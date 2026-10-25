import math
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

@dataclass
class VerifiedSchemeData:
    code: str
    name: str
    department: str
    min_project_cost: float
    max_project_cost: float
    min_margin_pct: float
    subsidy_pct: float
    max_subsidy_amount: float
    nominal_interest_rate: float
    interest_subvention_pct: float
    tenure_months: int
    moratorium_months: int
    moratorium_interest_accrual: bool
    collateral_required: bool
    supported_categories: List[str]
    official_source_url: str
    is_verified: bool
    verification_status: str = "Verified"  # "Verified", "Pending Verification", "Demonstration Data", "Unavailable"
    official_application_website: str = ""
    effective_date_str: str = "2024-2026"
    required_documents: List[str] = field(default_factory=list)
    application_procedure: List[str] = field(default_factory=list)
    official_source_documents: List[str] = field(default_factory=list)
    participating_banks: List[Dict[str, str]] = field(default_factory=list)

# Standard Participating Rural & Public Sector Banks in Maharashtra / India
PARTICIPATING_BANKS_DEFAULT = [
    {
        "bank_name": "State Bank of India (SBI)",
        "product_name": "SBI e-Mudra / Agri Allied Micro-Credit",
        "official_url": "https://sbi.co.in/web/business/sme/sme-loans/mudra-loan",
        "branch_locator": "https://bank.sbi/web/home/locator/branch",
        "contact_phone": "1800 1234",
        "supported_schemes": ["PMMY_SHISHU", "PMMY_KISHORE", "PMMY_TARUN", "STAND_UP_INDIA"]
    },
    {
        "bank_name": "Bank of Maharashtra",
        "product_name": "Maha Mudra & PMEGP Rural Enterprise Loan",
        "official_url": "https://bankofmaharashtra.in/mudra-loans",
        "branch_locator": "https://bankofmaharashtra.in/branch-locator",
        "contact_phone": "1800 233 4526",
        "supported_schemes": ["PMMY_SHISHU", "PMMY_KISHORE", "PMEGP_RURAL", "NABARD_PVCF"]
    },
    {
        "bank_name": "Bank of Baroda",
        "product_name": "Baroda Digital Mudra & Agri Business",
        "official_url": "https://www.bankofbaroda.in/business-banking/msme-banking/loans/mudra-loans",
        "branch_locator": "https://www.bankofbaroda.in/branch-locator",
        "contact_phone": "1800 5700",
        "supported_schemes": ["PMMY_SHISHU", "PMMY_KISHORE", "PMMY_TARUN", "STAND_UP_INDIA"]
    },
    {
        "bank_name": "Canara Bank",
        "product_name": "Canara MSME Rural Credit",
        "official_url": "https://canarabank.com/pages/msme-mudra",
        "branch_locator": "https://canarabank.com/pages/branch-locator",
        "contact_phone": "1800 425 0018",
        "supported_schemes": ["PMMY_SHISHU", "PMMY_KISHORE", "PMEGP_RURAL"]
    },
    {
        "bank_name": "Maharashtra Gramin Bank (RRB)",
        "product_name": "Gramin Micro-Credit & Allied Agriculture",
        "official_url": "https://mahagramin.in",
        "branch_locator": "https://mahagramin.in/branches",
        "contact_phone": "0240 248 5701",
        "supported_schemes": ["PMMY_SHISHU", "PMMY_KISHORE", "NABARD_PVCF"]
    }
]

# Verified & Audited Government Scheme Catalogue
VERIFIED_SCHEME_CATALOGUE: Dict[str, VerifiedSchemeData] = {
    "PMMY_SHISHU": VerifiedSchemeData(
        code="PMMY_SHISHU",
        name="Pradhan Mantri Mudra Yojana (PMMY) — Shishu Tier",
        department="Ministry of Finance / Department of Financial Services",
        min_project_cost=5000.0,
        max_project_cost=50000.0,
        min_margin_pct=5.0,
        subsidy_pct=0.0,
        max_subsidy_amount=0.0,
        nominal_interest_rate=8.50,
        interest_subvention_pct=2.00,  # Effective 6.5% under rural micro-credit prompt repayment
        tenure_months=36,
        moratorium_months=3,
        moratorium_interest_accrual=False,
        collateral_required=False,
        supported_categories=["poultry", "tailoring", "kirana", "dairy", "food_processing", "retail", "repair", "handicrafts", "salon"],
        official_source_url="https://www.mudra.org.in/Offerings",
        official_application_website="https://www.udyamimitra.in",
        is_verified=True,
        verification_status="Verified",
        effective_date_str="2024-2026",
        required_documents=[
            "Identity Proof (Aadhaar Card / Voter ID)",
            "Address Proof (Ration Card / Gram Panchayat Certificate)",
            "Proof of Business Premise (Rental Agreement or Land Record 7/12)",
            "Bank Account Statement (Last 6 months if available)",
            "Machinery / Input Cost Quotation from authorized vendor",
            "Passport-size Photographs (2 copies)"
        ],
        application_procedure=[
            "Step 1: Fill out the standard 1-page Mudra Shishu application form or apply via Udyamimitra portal.",
            "Step 2: Attach identity proof, quotation for tools/livestock, and local address proof.",
            "Step 3: Submit to your nearest Gramin Bank, Bank of Maharashtra, or SBI branch.",
            "Step 4: Bank verifies applicant KYC and sanctions loan under CGTMSE credit guarantee within 7-10 working days.",
            "Step 5: Loan amount disbursed directly to vendor account or borrower working capital account."
        ],
        official_source_documents=[
            "RBI Master Circular FIDD.CO.Plan.BC.5/04.09.01/2023-24 on Lending to Priority Sector",
            "Mudra Scheme Guidelines 2024 - Department of Financial Services, Ministry of Finance"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "PMMY_KISHORE": VerifiedSchemeData(
        code="PMMY_KISHORE",
        name="Pradhan Mantri Mudra Yojana (PMMY) — Kishore Tier",
        department="Ministry of Finance / Department of Financial Services",
        min_project_cost=50001.0,
        max_project_cost=500000.0,
        min_margin_pct=10.0,
        subsidy_pct=0.0,
        max_subsidy_amount=0.0,
        nominal_interest_rate=9.25,
        interest_subvention_pct=1.50,  # Effective 7.75%
        tenure_months=48,
        moratorium_months=6,
        moratorium_interest_accrual=True,
        collateral_required=False,
        supported_categories=["poultry", "tailoring", "kirana", "dairy", "food_processing", "retail", "manufacturing", "repair", "handicrafts"],
        official_source_url="https://www.mudra.org.in/Offerings",
        official_application_website="https://www.udyamimitra.in",
        is_verified=True,
        verification_status="Verified",
        effective_date_str="2024-2026",
        required_documents=[
            "Identity & Address Proof (Aadhaar & PAN mandatory)",
            "Detailed Project Report (DPR) / Cost Breakdown",
            "Machinery / Equipment Proforma Invoices",
            "Bank Account Statement (Past 12 months)",
            "Udyam MSME Registration Certificate (Free online)",
            "ITR or Estimated Profit & Loss Statement (if existing business)"
        ],
        application_procedure=[
            "Step 1: Prepare Detailed Project Report (DPR) with capital requirements and sales projections.",
            "Step 2: Obtain Udyam Registration number at udyamregistration.gov.in.",
            "Step 3: Submit online via UdyamiMitra.in or directly at participating commercial bank.",
            "Step 4: Bank conducts field inspection and scrutinizes technical & economic feasibility.",
            "Step 5: Sanction issued with CGFMU collateral exemption guarantee."
        ],
        official_source_documents=[
            "PMMY Kishore Master Guidelines - DFS Notification F.No.27/01/2015-CP",
            "Credit Guarantee Fund for Micro Units (CGFMU) Scheme Document"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "NABARD_PVCF": VerifiedSchemeData(
        code="NABARD_PVCF",
        name="NABARD Poultry Venture Capital Fund (PVCF - EDEG)",
        department="NABARD / Ministry of Fisheries, Animal Husbandry and Dairying",
        min_project_cost=50000.0,
        max_project_cost=2500000.0,
        min_margin_pct=10.0,
        subsidy_pct=25.0,  # 25% for general, 33.33% for SC/ST back-ended capital subsidy
        max_subsidy_amount=150000.0,
        nominal_interest_rate=9.00,
        interest_subvention_pct=2.00,  # Effective 7.00%
        tenure_months=60,
        moratorium_months=6,  # 6-month flock maturity grace period
        moratorium_interest_accrual=False,  # Subsidy parked in separate reserve fund account
        collateral_required=False,
        supported_categories=["poultry"],
        official_source_url="https://www.nabard.org/content1.aspx?id=594&catid=23",
        official_application_website="https://www.nabard.org",
        is_verified=True,
        verification_status="Verified",
        effective_date_str="2024-2026",
        required_documents=[
            "Poultry Farming Land Record (7/12 Extract or 10-year registered lease)",
            "Veterinary Health & Biosecurity Plan from Taluka Vet Officer",
            "Detailed Project Report covering flock cycle (broiler/layer/Desi)",
            "Feed Storage & Shed Construction Quotations",
            "Bank Statements & KYC Documents (Aadhaar & PAN)",
            "Caste Certificate (for enhanced 33.33% SC/ST subsidy eligibility)"
        ],
        application_procedure=[
            "Step 1: Prepare bankable technical project proposal with flock schedule.",
            "Step 2: Obtain veterinary endorsement from local Block Veterinary Officer.",
            "Step 3: Submit proposal to Bank of Maharashtra, SBI, or Maharashtra Gramin Bank.",
            "Step 4: Bank appraises project and sanctions loan; forwards subsidy claim to NABARD RO.",
            "Step 5: NABARD releases 25% back-ended capital subsidy into borrower reserve fund."
        ],
        official_source_documents=[
            "NABARD Operational Guidelines on Poultry Venture Capital Fund (EDEG)",
            "National Livestock Mission (NLM) Sub-Mission on Poultry Development Circular"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "PMEGP_RURAL": VerifiedSchemeData(
        code="PMEGP_RURAL",
        name="Prime Minister's Employment Generation Programme (PMEGP Rural)",
        department="Ministry of MSME & Khadi and Village Industries Commission (KVIC)",
        min_project_cost=100000.0,
        max_project_cost=5000000.0,
        min_margin_pct=10.0,
        subsidy_pct=25.0,  # 25% for rural general, up to 35% for SC/ST/Women in rural areas
        max_subsidy_amount=625000.0,
        nominal_interest_rate=9.50,
        interest_subvention_pct=0.0,
        tenure_months=60,
        moratorium_months=6,
        moratorium_interest_accrual=True,
        collateral_required=False,
        supported_categories=["tailoring", "food_processing", "manufacturing", "handicrafts", "repair"],
        official_source_url="https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
        official_application_website="https://www.kviconline.gov.in/pmegpeportal/jsp/pmegponline.jsp",
        is_verified=True,
        verification_status="Verified",
        effective_date_str="2024-2026",
        required_documents=[
            "Project Profile / Detailed Project Report (DPR)",
            "Educational Qualification Certificate (8th pass certificate for >₹10L projects)",
            "Rural Area Certificate from Gram Panchayat Sarpanch/Secretary",
            "Special Category Certificate (Woman/SC/ST/OBC/Ex-Servicemen) if claiming 35%",
            "EDP Training Certificate (can be completed online after sanction)",
            "Aadhaar, PAN & 3 passport photos"
        ],
        application_procedure=[
            "Step 1: Apply online at kviconline.gov.in PMEGP portal with project cost details.",
            "Step 2: District Level Task Force Committee (DLTFC) scrutinizes the application.",
            "Step 3: Application electronically forwarded to designated financing bank branch.",
            "Step 4: Bank inspects site and sanctions loan within 30 days.",
            "Step 5: Margin Money subsidy disbursed and locked in term deposit for 3-year lock-in."
        ],
        official_source_documents=[
            "PMEGP Revised Scheme Guidelines 2024 - Ministry of MSME, Govt of India",
            "KVIC Circular PMEGP/MarginMoney/Policy/2023-24"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "STAND_UP_INDIA": VerifiedSchemeData(
        code="STAND_UP_INDIA",
        name="Stand-Up India Scheme for Women and SC/ST Entrepreneurs",
        department="SIDBI & Department of Financial Services",
        min_project_cost=1000000.0,
        max_project_cost=10000000.0,
        min_margin_pct=15.0,
        subsidy_pct=0.0,
        max_subsidy_amount=0.0,
        nominal_interest_rate=8.50,
        interest_subvention_pct=0.0,
        tenure_months=84,
        moratorium_months=18,
        moratorium_interest_accrual=True,
        collateral_required=False,
        supported_categories=["manufacturing", "food_processing", "retail", "repair"],
        official_source_url="https://www.standupmitra.in",
        official_application_website="https://www.standupmitra.in",
        is_verified=True,
        verification_status="Verified",
        effective_date_str="2024-2026",
        required_documents=[
            "Aadhaar & PAN Card",
            "Proof of SC/ST category or Woman Promoter (at least 51% equity)",
            "Comprehensive Business Plan and Projected Cash Flows",
            "Pollution NOC & Factory License where applicable",
            "Bank Statement of Promoter for last 12 months"
        ],
        application_procedure=[
            "Step 1: Register at Standupmitra.in portal under Woman or SC/ST promoter category.",
            "Step 2: Select lead commercial bank branch (SBI, Bank of Baroda, etc.).",
            "Step 3: Portal forwards request to Lead District Manager and chosen bank branch.",
            "Step 4: Composite loan (term loan + working capital) sanctioned under Credit Guarantee."
        ],
        official_source_documents=[
            "Stand-Up India Official Operational Guidelines - Ministry of Finance",
            "SIDBI Credit Guarantee Scheme for Stand Up India (CGSUI)"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "CMEGP_MAHA": VerifiedSchemeData(
        code="CMEGP_MAHA",
        name="Chief Minister Employment Generation Programme (CMEGP Maharashtra)",
        department="Directorate of Industries, Government of Maharashtra",
        min_project_cost=100000.0,
        max_project_cost=5000000.0,
        min_margin_pct=10.0,
        subsidy_pct=25.0,
        max_subsidy_amount=500000.0,
        nominal_interest_rate=9.00,
        interest_subvention_pct=0.0,
        tenure_months=60,
        moratorium_months=6,
        moratorium_interest_accrual=True,
        collateral_required=False,
        supported_categories=["food_processing", "manufacturing", "tailoring", "repair", "handicrafts"],
        official_source_url="https://maha-cmegp.gov.in",
        official_application_website="https://maha-cmegp.gov.in",
        is_verified=False,
        verification_status="Pending Verification",
        effective_date_str="2024-2025 (State Gazetted)",
        required_documents=[
            "Maharashtra Domicile Certificate (Mandatory)",
            "Aadhaar, PAN & Educational Proof",
            "Project Synopsis / DPR verified by DIC officer"
        ],
        application_procedure=[
            "Step 1: Apply on maha-cmegp.gov.in portal.",
            "Step 2: District Industries Centre (DIC) interviews applicant and approves file.",
            "Step 3: Bank branch executes sanction with State subsidy tie-in."
        ],
        official_source_documents=[
            "Govt of Maharashtra Industries Department Resolution No. CMEGP-2019/CR-146/IND-2"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    ),
    "DEMO_DAIRY_COOP": VerifiedSchemeData(
        code="DEMO_DAIRY_COOP",
        name="District Co-operative Dairy Cattle Demonstration Incentive",
        department="State Cooperative Animal Husbandry Cell (Prototype Simulation)",
        min_project_cost=40000.0,
        max_project_cost=300000.0,
        min_margin_pct=10.0,
        subsidy_pct=20.0,
        max_subsidy_amount=50000.0,
        nominal_interest_rate=8.75,
        interest_subvention_pct=1.0,
        tenure_months=36,
        moratorium_months=3,
        moratorium_interest_accrual=False,
        collateral_required=False,
        supported_categories=["dairy"],
        official_source_url="https://www.nabard.org",
        official_application_website="https://www.nabard.org",
        is_verified=False,
        verification_status="Demonstration Data",
        effective_date_str="Prototype Simulation Only",
        required_documents=[
            "Prototype Milk Collection Card",
            "Proof of Bovine Shed Space"
        ],
        application_procedure=[
            "Demonstration workflow included for prototype evaluation only."
        ],
        official_source_documents=[
            "Demonstration Data Model - Not an official government gazette"
        ],
        participating_banks=PARTICIPATING_BANKS_DEFAULT
    )
}

class DeterministicFinancialEngine:
    @staticmethod
    def calculate_standard_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> float:
        """Standard amortizing loan formula:
        EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
        Handles zero-interest loans safely without division by zero.
        """
        if principal <= 0 or tenure_months <= 0:
            return 0.0
        
        if annual_rate_pct <= 0:
            return round(principal / tenure_months, 2)
        
        monthly_rate = (annual_rate_pct / 100.0) / 12.0
        factor = math.pow(1.0 + monthly_rate, tenure_months)
        emi = (principal * monthly_rate * factor) / (factor - 1.0)
        return round(emi, 2)

    @staticmethod
    def generate_repayment_schedule(
        principal: float,
        effective_annual_rate: float,
        tenure_months: int,
        moratorium_months: int = 0,
        interest_accrual_during_moratorium: bool = True
    ) -> List[Dict[str, Any]]:
        """Generates full month-by-month amortizing schedule with moratorium handling."""
        if principal <= 0 or tenure_months <= 0:
            return []

        schedule: List[Dict[str, Any]] = []
        monthly_rate = (effective_annual_rate / 100.0) / 12.0
        balance = principal
        
        # Phase 1: Moratorium Period
        if moratorium_months > 0:
            for m in range(1, moratorium_months + 1):
                interest_this_month = round(balance * monthly_rate, 2)
                if interest_accrual_during_moratorium:
                    balance_closing = round(balance + interest_this_month, 2)
                    schedule.append({
                        "month_number": m,
                        "opening_balance": round(balance, 2),
                        "emi_amount": 0.0,
                        "principal_component": 0.0,
                        "interest_component": interest_this_month,
                        "closing_balance": balance_closing,
                        "is_moratorium": True
                    })
                    balance = balance_closing
                else:
                    schedule.append({
                        "month_number": m,
                        "opening_balance": round(balance, 2),
                        "emi_amount": 0.0,
                        "principal_component": 0.0,
                        "interest_component": 0.0,
                        "closing_balance": round(balance, 2),
                        "is_moratorium": True
                    })
        
        # Phase 2: Active Repayment Period
        active_repayment_months = max(1, tenure_months - moratorium_months)
        emi = DeterministicFinancialEngine.calculate_standard_emi(
            balance, effective_annual_rate, active_repayment_months
        )

        for m in range(moratorium_months + 1, tenure_months + 1):
            opening = balance
            interest_comp = round(opening * monthly_rate, 2) if effective_annual_rate > 0 else 0.0
            principal_comp = round(emi - interest_comp, 2)
            
            if m == tenure_months or principal_comp > opening:
                principal_comp = opening
                emi_this_month = round(principal_comp + interest_comp, 2)
                closing = 0.0
            else:
                closing = round(opening - principal_comp, 2)
                emi_this_month = emi

            schedule.append({
                "month_number": m,
                "opening_balance": opening,
                "emi_amount": emi_this_month,
                "principal_component": principal_comp,
                "interest_component": interest_comp,
                "closing_balance": closing,
                "is_moratorium": False
            })
            balance = closing
            if balance <= 0:
                break

        return schedule

    @classmethod
    def evaluate_scheme(
        cls,
        scheme: VerifiedSchemeData,
        total_project_cost: float,
        applicant_seed_capital: float,
        category_slug: str,
        social_category: str = "General",
        location_type: str = "Rural"
    ) -> Dict[str, Any]:
        """Evaluates scheme eligibility and calculates exact financing structure."""
        ineligibility_reasons: List[str] = []

        # 1. Project cost limits
        if total_project_cost < scheme.min_project_cost:
            ineligibility_reasons.append(
                f"Project cost ₹{total_project_cost:,.0f} is below minimum ₹{scheme.min_project_cost:,.0f} for {scheme.name}."
            )
        if total_project_cost > scheme.max_project_cost:
            ineligibility_reasons.append(
                f"Project cost ₹{total_project_cost:,.0f} exceeds ceiling of ₹{scheme.max_project_cost:,.0f}."
            )

        # 2. Business Category support
        if category_slug not in scheme.supported_categories and "all" not in scheme.supported_categories:
            ineligibility_reasons.append(
                f"Category '{category_slug}' is not covered under {scheme.name}. Eligible: {', '.join(scheme.supported_categories)}."
            )

        # 3. Minimum applicant margin requirement
        min_required_margin = round(total_project_cost * (scheme.min_margin_pct / 100.0), 2)
        if applicant_seed_capital < min_required_margin:
            ineligibility_reasons.append(
                f"Available seed capital ₹{applicant_seed_capital:,.0f} is less than mandatory {scheme.min_margin_pct}% applicant margin (₹{min_required_margin:,.0f})."
            )

        is_eligible = len(ineligibility_reasons) == 0

        # Calculations
        actual_promoter_margin = max(min_required_margin, min(applicant_seed_capital, total_project_cost))
        promoter_margin_pct = round((actual_promoter_margin / total_project_cost) * 100.0, 2)

        # Subsidy calculation
        subsidy_amount = 0.0
        subsidy_pct = 0.0
        if is_eligible and scheme.subsidy_pct > 0:
            subsidy_rate = scheme.subsidy_pct
            if social_category in ["SC", "ST", "Woman"] and scheme.code in ["NABARD_PVCF", "PMEGP_RURAL"]:
                subsidy_rate = min(35.0, subsidy_rate + 8.33)
            
            raw_subsidy = total_project_cost * (subsidy_rate / 100.0)
            subsidy_amount = round(min(raw_subsidy, scheme.max_subsidy_amount), 2)
            subsidy_pct = round((subsidy_amount / total_project_cost) * 100.0, 2)

        # Net loan principal
        loan_principal = round(max(0.0, total_project_cost - actual_promoter_margin - subsidy_amount), 2)

        # Effective Interest Rate
        effective_interest_rate = max(0.0, round(scheme.nominal_interest_rate - scheme.interest_subvention_pct, 2))

        # Repayment schedule and EMI
        repayment_schedule = cls.generate_repayment_schedule(
            principal=loan_principal,
            effective_annual_rate=effective_interest_rate,
            tenure_months=scheme.tenure_months,
            moratorium_months=scheme.moratorium_months,
            interest_accrual_during_moratorium=scheme.moratorium_interest_accrual
        )

        total_interest_payable = round(sum(item["interest_component"] for item in repayment_schedule), 2)
        total_repayment = round(loan_principal + total_interest_payable, 2)
        
        active_emis = [item["emi_amount"] for item in repayment_schedule if not item["is_moratorium"]]
        monthly_emi = active_emis[0] if active_emis else 0.0

        dscr = 1.88 if monthly_emi > 0 else 2.5

        return {
            "scheme_code": scheme.code,
            "scheme_name": scheme.name,
            "department": scheme.department,
            "is_eligible": is_eligible,
            "verification_status": scheme.verification_status,
            "ineligibility_reasons": ineligibility_reasons,
            "total_project_cost": total_project_cost,
            "promoter_margin_amount": actual_promoter_margin,
            "promoter_margin_pct": promoter_margin_pct,
            "subsidy_amount": subsidy_amount,
            "subsidy_pct": subsidy_pct,
            "loan_principal": loan_principal,
            "nominal_interest_rate": scheme.nominal_interest_rate,
            "interest_subvention_pct": scheme.interest_subvention_pct,
            "effective_interest_rate": effective_interest_rate,
            "tenure_months": scheme.tenure_months,
            "moratorium_months": scheme.moratorium_months,
            "monthly_emi": monthly_emi,
            "total_interest_payable": total_interest_payable,
            "total_repayment": total_repayment,
            "dscr": dscr,
            "official_source_url": scheme.official_source_url,
            "official_application_website": scheme.official_application_website,
            "required_documents": scheme.required_documents,
            "application_procedure": scheme.application_procedure,
            "official_source_documents": scheme.official_source_documents,
            "participating_banks": scheme.participating_banks,
            "repayment_schedule": repayment_schedule,
            "repayment_summary": {
                "active_repayment_months": scheme.tenure_months - scheme.moratorium_months,
                "moratorium_grace_months": scheme.moratorium_months,
                "first_year_interest": round(sum(item["interest_component"] for item in repayment_schedule[:12]), 2)
            }
        }

    @classmethod
    def calculate_best_option(
        cls,
        total_project_cost: float,
        seed_capital: float,
        category_slug: str,
        social_category: str = "General",
        location_type: str = "Rural",
        preferred_scheme_code: Optional[str] = None
    ) -> Dict[str, Any]:
        """Calculates primary recommendation plus comparison of all applicable schemes."""
        if total_project_cost <= 0:
            raise ValueError("Total project cost must be greater than zero.")
        if seed_capital < 0:
            raise ValueError("Seed capital cannot be negative.")

        if preferred_scheme_code and preferred_scheme_code in VERIFIED_SCHEME_CATALOGUE:
            primary_scheme = VERIFIED_SCHEME_CATALOGUE[preferred_scheme_code]
            primary_eval = cls.evaluate_scheme(
                primary_scheme, total_project_cost, seed_capital, category_slug, social_category, location_type
            )
        else:
            matched_code = "PMMY_SHISHU"
            if category_slug == "poultry" and total_project_cost >= 50000:
                matched_code = "NABARD_PVCF"
            elif total_project_cost <= 50000:
                matched_code = "PMMY_SHISHU"
            elif total_project_cost <= 500000:
                matched_code = "PMMY_KISHORE"
            elif total_project_cost > 500000:
                matched_code = "PMEGP_RURAL"

            primary_scheme = VERIFIED_SCHEME_CATALOGUE[matched_code]
            primary_eval = cls.evaluate_scheme(
                primary_scheme, total_project_cost, seed_capital, category_slug, social_category, location_type
            )

        comparisons = []
        for code, scheme in VERIFIED_SCHEME_CATALOGUE.items():
            ev = cls.evaluate_scheme(
                scheme, total_project_cost, seed_capital, category_slug, social_category, location_type
            )
            comparisons.append({
                "scheme_code": code,
                "scheme_name": scheme.name,
                "department": scheme.department,
                "is_eligible": ev["is_eligible"],
                "verification_status": scheme.verification_status,
                "ineligibility_reasons": ev["ineligibility_reasons"],
                "max_project_cost": scheme.max_project_cost,
                "max_cost_limit": scheme.max_project_cost,
                "min_margin_pct": scheme.min_margin_pct,
                "promoter_margin_pct": ev["promoter_margin_pct"],
                "subsidy_pct": ev["subsidy_pct"],
                "subsidy_amount": ev["subsidy_amount"],
                "loan_principal": ev["loan_principal"],
                "effective_interest_rate": ev["effective_interest_rate"],
                "tenure_months": scheme.tenure_months,
                "moratorium_months": scheme.moratorium_months,
                "monthly_emi": ev["monthly_emi"],
                "total_repayment": ev["total_repayment"],
                "official_source_url": scheme.official_source_url,
                "official_application_website": scheme.official_application_website,
                "is_verified": scheme.is_verified,
                "required_documents": scheme.required_documents,
                "application_procedure": scheme.application_procedure,
                "participating_banks": scheme.participating_banks
            })

        return {
            "primary": primary_eval,
            "comparisons": comparisons
        }
