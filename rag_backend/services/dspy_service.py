import dspy
from dotenv import load_dotenv
import os

load_dotenv()

# Configure DSPy
dspy.settings.configure(
    lm=dspy.LM(
        model="openai/gpt-4o-mini",
        api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.2,
    )
)

# ---------------- RAG SIGNATURE ----------------
class RAGSignature(dspy.Signature):
    """
    You are a document assistant.

    Use ONLY the provided context to answer.

    If the answer is present in the context:
        respond clearly using Markdown format.
        Use bullet points for lists.
        Use short paragraphs or headings when helpful.

    If the topic is NOT mentioned:
        say: "This topic is not mentioned in the document."
        respond cautiously.
        Still use Markdown format.

    Always return:
    - answer in Markdown format
    - 3 follow-up questions (only if answer exists)

    Do NOT return plain numbered text.
    Use Markdown bullet lists instead.
    """

    context = dspy.InputField()
    question = dspy.InputField()

    answer = dspy.OutputField(desc="Markdown formatted answer")
    questions = dspy.OutputField(desc="List of follow-up questions")



predict_rag = dspy.Predict(RAGSignature)

# ---------------- EVALUATION ----------------
class EvalSignature(dspy.Signature):
    """
Evaluate how well the answer is supported by the provided context.

Rules:

1. If the answer is clearly supported by context:
   confidence: 0.8 – 0.95

2. If partially supported:
   confidence: 0.5 – 0.75

3. If weakly supported:
   confidence: 0.2 – 0.5

4. If the topic is NOT mentioned in the context at all:
   - Mark relevant = false
   - Say it is not mentioned in the document
   - Return a confident negative response
   - confidence: 0.6 – 0.8

Important:
- When no relevant context exists, do NOT return 0 confidence.
- Instead return a confident "not mentioned in the document" response.
- Never return 1.0 unless the answer is explicitly and strongly supported.
"""

    question = dspy.InputField()
    context = dspy.InputField()
    answer = dspy.InputField()

    relevant = dspy.OutputField()
    confidence = dspy.OutputField()


eval_predict = dspy.Predict(EvalSignature)


def evaluate_answer(question: str, context: str, answer: str):
    result = eval_predict(
        question=question,
        context=context,
        answer=answer
    )

    return {
        "relevant": result.relevant,
        "confidence": result.confidence
    }

# ---------------- QUERY REWRITE ----------------
class QueryRewriteSignature(dspy.Signature):
    """
    Rewrite question to improve retrieval.
    """

    question = dspy.InputField()
    rewritten = dspy.OutputField()


rewrite_predict = dspy.Predict(QueryRewriteSignature)


def optimize_query(query: str):
    result = rewrite_predict(question=query)
    return result.rewritten

# ---------------- MAIN FUNCTION ----------------
def generate_dspy_answer(query: str, chunks: list[str]):

    # rewrite query
    query = optimize_query(query)

    context = "\n".join(chunks)

    # if not context.strip():
    #     return {
    #         "answer": "This topic is not mentioned in the document.",
    #         "questions": [],
    #         "evaluation": {
    #             "relevant": False,
    #             "confidence": 0.7
    #         }
    #     }

    result = predict_rag(
        question=query,
        context=context
    )

    questions = result.questions

    if isinstance(questions, str):
        questions = [q.strip() for q in questions.split("?") if q.strip()]
        questions = [q + "?" for q in questions][:3]

    answer_text = result.answer

    eval_result = evaluate_answer(query, context, answer_text)
    print("Query:", query)
    print("Context:", context)
    print("Answer:", answer_text)
    print("Evaluation Result:", eval_result)
    return {
        "answer": answer_text,
        "questions": questions if isinstance(questions, list) else [],
        "evaluation": eval_result
    }
