from services.dspy_service import generate_dspy_answer, optimize_query

def generate_answer_with_suggestions(query: str, chunks: list[str]):
  
    improved_query = optimize_query(query)
    print("Original:", query)
    print("Optimized:", improved_query)
    return generate_dspy_answer(improved_query, chunks)
