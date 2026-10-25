import math
import hashlib
from typing import List, Dict, Any, Optional

# Curated reference business guides for rural micro-enterprises
SEED_KNOWLEDGE_DOCUMENTS = [
    {
        "title": "NABARD Standard Operating Procedure: Small-Scale Layer & Desi Poultry Rearing",
        "category": "poultry",
        "author": "NABARD Animal Husbandry Division",
        "content": """
        1. Housing & Biosecurity: Minimum 1.5 to 2.0 sq ft per bird for deep litter housing. Maintain wire mesh ventilation to prevent ammonia buildup. Ensure all-weather access road for weekly feed deliveries.
        2. Feed & Input Economics: Feed constitutes 68% to 72% of recurring costs. Commercial balanced mash costs ₹32-₹38/kg. Desi scavenging birds require supplementary crushed maize and azolla to reduce feed costs by 22%.
        3. Veterinary & Vaccination Schedule: Day 1: Marek's; Day 7: Lasota (RD F1); Day 14: IBD; Day 28: Lasota booster. Proximity to taluka veterinary clinic within 8 km is vital for mortality management.
        4. Marketing & Revenue Channels: Desi eggs command 80%-120% premium over commercial white eggs (₹9-₹13 per egg retail vs ₹6 wholesale). Fresh broiler meat is sold primarily at bi-weekly rural haats and local highway eateries.
        5. Moratorium & Cash Flow: Egg laying starts at week 18-20. Loan structure must provide a 5-6 month moratorium to match the flock rearing gestation period.
        """
    },
    {
        "title": "KVIC Field Manual: Rural Garment Stitching & Custom Tailoring Enterprise",
        "category": "tailoring",
        "author": "Khadi & Village Industries Commission (KVIC)",
        "content": """
        1. Machinery Setup: Motorized lockstitch industrial sewing machine, 3-thread overlock machine, and pressing iron. Typical machinery capital requirement: ₹35,000 to ₹55,000.
        2. Local Market Demand: Peak season coincides with school reopenings (June-July for uniforms) and festive seasons (Diwali, Eid, wedding months). Standard tailoring charges: ₹150-₹250 per blouse, ₹300-₹500 per salwar suit.
        3. Working Capital: Fabric trims, threads, zippers, and canvas cloth require monthly rolling stock of ₹5,000-₹8,000.
        4. Value Addition & Niches: Custom bridal blouses, school uniform contracts with local Zilla Parishad schools, and alteration services for weekly haat clothing stalls.
        """
    },
    {
        "title": "Rural Retail Best Practices: Kirana & FMCG Inventory Turnaround",
        "category": "kirana",
        "author": "Department of Rural Development & Micro-Enterprise",
        "content": """
        1. Assortment Strategy: High-frequency daily staples (flour, oil, salt, pulses, tea, sugar) yield 6%-10% gross margins. Packaged snacks, biscuits, detergents, and mobile accessories yield 15%-25% margins.
        2. Credit Management: Limiting customer credit to under 15% of monthly revenue is crucial to prevent working capital exhaustion.
        3. Location & Footfall: Proximity to village bus stop or temple square guarantees steady footfall. Direct supplier delivery or bi-weekly visits to nearest wholesale mandi optimizes freight cost.
        """
    },
    {
        "title": "Department of Animal Husbandry: Rural Dairy & Milk Collection Center Guidelines",
        "category": "dairy",
        "author": "Ministry of Fisheries, Animal Husbandry & Dairying",
        "content": """
        1. Animal Selection: High-yielding cross-bred HF/Jersey cows (10-14 L/day) or Murrah buffaloes (8-10 L/day). Cattle capital requirement: ₹60,000 to ₹80,000 per animal.
        2. Feed Management: Green fodder (Napier grass/maize silage) 25-30 kg/day + dry fodder 5 kg/day + balanced cattle feed concentrate based on milk yield (400g per liter produced).
        3. Offtake Security: Tie-up with district cooperative milk union (e.g. Mahanand, Amul, Nandini) ensures daily assured cashflow based on FAT and SNF testing.
        """
    }
]

class RAGService:
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        i = 0
        while i < len(words):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
            i += max(1, chunk_size - overlap)
        return chunks

    @classmethod
    def get_context_for_category(cls, category_slug: str) -> List[Dict[str, Any]]:
        """Retrieves verified business guide chunks for the selected category."""
        matched = []
        for doc in SEED_KNOWLEDGE_DOCUMENTS:
            if doc["category"] == category_slug:
                chunks = cls.chunk_text(doc["content"])
                for idx, ch in enumerate(chunks):
                    matched.append({
                        "document_title": doc["title"],
                        "author": doc["author"],
                        "chunk_index": idx,
                        "content": ch
                    })
        return matched
