from openai import OpenAI
import json

client = OpenAI()

def generate_answer_with_suggestions(query: str, chunks: list[str]):

    context = "\n".join(chunks)

    prompt = f"""
You are answering based ONLY on the provided context.

1. Answer the user's question.
2. Suggest 3 follow-up questions strictly from this context.
Do NOT invent anything outside context.

Return ONLY valid JSON:

{{
  "answer": "",
  "questions": ["", "", ""]
}}

Context:
{context}

User Question:
{query}
"""

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    content = res.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except:
        return {
            "answer": content,
            "questions": []
        }
