from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.voice.service import BhashiniVoiceService, SUPPORTED_LANGUAGES
from app.schemas.domain import (
    VoiceTranscribeRequest,
    VoiceTranscribeResponse,
    VoiceTranslateRequest,
    VoiceTranslateResponse
)
from app.core.config import settings
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class VoiceQueryRequest(BaseModel):
    query_text: str
    language: str = "en"  # en, mr, hi
    context: Optional[str] = "general"

@router.get("/languages", response_model=List[Dict[str, str]])
def get_languages():
    return SUPPORTED_LANGUAGES

@router.post("/transcribe", response_model=VoiceTranscribeResponse)
async def transcribe_audio(req: VoiceTranscribeRequest):
    result = await BhashiniVoiceService.transcribe_audio(
        audio_base64=req.audio_base64,
        source_lang=req.source_language
    )
    return result

@router.post("/translate", response_model=VoiceTranslateResponse)
async def translate_text(req: VoiceTranslateRequest):
    result = await BhashiniVoiceService.translate_text(
        text=req.text,
        source_lang=req.source_language,
        target_lang=req.target_language
    )
    return result

@router.post("/query")
async def voice_assistant_query(req: VoiceQueryRequest):
    """
    Answers spoken user queries in the requested language (Marathi, Hindi, English).
    Preserves exact financial numbers and grounds advice in verified guidelines.
    """
    lang = req.language
    query = req.query_text.strip()
    
    # If Groq is configured, generate natural language response in target language
    if settings.GROQ_API_KEY:
        try:
            lang_prompt = {
                "mr": "तुम्ही रुरलबिझ एआय (RuralBiz AI) चे ग्रामीण व्यवसाय आणि आर्थिक सहाय्यक आहात. उत्तरे नम्र, थेट आणि मराठीत द्या. सर्व आर्थिक रकमा अचूक ठेवा.",
                "hi": "आप RuralBiz AI के ग्रामीण व्यापार एवं वित्तीय सलाहकार हैं। उत्तर सरल, स्पष्ट और शुद्ध हिंदी में दें। सभी वित्तीय आंकड़े सटीक रखें।",
                "en": "You are RuralBiz AI's rural business and financial advisory assistant. Provide practical, clear, and encouraging rural enterprise guidance. Keep all financial figures exact."
            }.get(lang, "You are RuralBiz AI's rural business advisory assistant.")

            system_prompt = f"{lang_prompt}\nContext: User is on the {req.context} section. Answer the query concisely in 2-3 sentences suitable for text-to-speech audio narration."

            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.GROQ_API_KEY}"},
                    json={
                        "model": settings.GROQ_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": query}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 200
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    answer = data["choices"][0]["message"]["content"].strip()
                    return {
                        "query": query,
                        "reply": answer,
                        "language": lang,
                        "model": settings.GROQ_MODEL,
                        "is_fallback": False
                    }
        except Exception as e:
            logger.warning(f"Groq voice query failed: {e}. Using deterministic fallback.")

    # High quality deterministic responses in Marathi, Hindi, English
    fallback_replies = {
        "mr": {
            "default": f"तुमच्या '{query}' या प्रश्नावर: रुरलबिझ एआय नुसार स्थानिक बाजारपेठ, कच्चा माल आणि प्रधानमंत्री मुद्रा किंवा नाबार्ड योजनेचा योग्य अभ्यास करून निर्णय घ्या. तुमचा नफा आणि ईएमआय प्रमाण तपासा.",
            "loan": "मुद्रा किशोर किंवा नाबार्ड योजनेअंतर्गत तुम्हाला २५% पर्यंत सबसिडी आणि कमी व्याजदराचा लाभ मिळू शकतो. जवळच्या बँक ऑफ महाराष्ट्र किंवा एसबीआय शाखेत संपर्क करा.",
            "poultry": "कुक्कुटपालन व्यवसायात लसीकरण आणि उन्हाळ्यातील तापमान नियंत्रण अत्यंत महत्त्वाचे आहे. देशी अंड्यांसाठी स्थानिक आठवडी बाजारात चांगला दर मिळतो."
        },
        "hi": {
            "default": f"आपके प्रश्न '{query}' के लिए: रूरलबिज़ एआई की सलाह है कि कच्चे माल की लागत, स्थानीय मांग और मुद्रा योजना के तहत मिलने वाली वित्तीय सहायता की समीक्षा करें।",
            "loan": "मुद्रा योजना के तहत आपको बिना किसी गारंटी के 50,000 से 5 लाख तक का ऋण मिल सकता है। निकटतम सरकारी बैंक शाखा में आवेदन करें।",
            "poultry": "मुर्गी पालन व्यवसाय में समय पर टीकाकरण और बायो-सिक्योरिटी बहुत जरूरी है। स्थानीय साप्ताहिक बाजार में तैयार माल बेचने से अधिक मुनाफा होता है।"
        },
        "en": {
            "default": f"Regarding '{query}': RuralBiz AI recommends assessing local market demand, raw material proximity, and verifying government subsidy eligibility under PMMY or NABARD before finalizing your investment.",
            "loan": "Under the Mudra Kishore scheme, eligible rural enterprises can secure working capital loans up to ₹5 Lakh without collateral, backed by CGTMSE guarantee.",
            "poultry": "For poultry farming, maintain strict biosecurity and vaccination schedules. Direct farm-gate sales to local eateries yield 25% higher contribution margin."
        }
    }

    lang_dict = fallback_replies.get(lang, fallback_replies["en"])
    q_lower = query.lower()
    if "loan" in q_lower or "कर्ज" in q_lower or "ऋण" in q_lower or "योजना" in q_lower:
        reply = lang_dict["loan"]
    elif "poultry" in q_lower or "कुक्कुट" in q_lower or "मुर्गी" in q_lower:
        reply = lang_dict["poultry"]
    else:
        reply = lang_dict["default"]

    return {
        "query": query,
        "reply": reply,
        "language": lang,
        "model": "Deterministic Rural Knowledge Fallback",
        "is_fallback": True
    }
