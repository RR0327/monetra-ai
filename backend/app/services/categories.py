"""Explainable, deterministic category rules for fictional transactions."""
CATEGORY_KEYWORDS = {
    "Rent": ("house rent", "apartment rent", "landlord"),
    "Food": ("kfc", "restaurant", "grocery", "groceries", "cafe", "lunch", "dinner"),
    "Transport": ("uber", "pathao", "bus", "ride", "rickshaw", "train"),
    "Shopping": ("daraz", "clothing", "fashion", "shoes", "bookstore"),
    "Utilities": ("internet", "electricity", "water bill", "mobile bill"),
    "Health": ("pharmacy", "medicine", "hospital"),
    "Education": ("tuition", "course", "school"),
}

def categorize(description: str, transaction_type: str = "expense") -> str:
    if transaction_type == "income":
        return "Income"
    normalized = description.casefold().strip()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(word in normalized for word in keywords):
            return category
    return "Other"
