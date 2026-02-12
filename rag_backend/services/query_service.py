from openai import OpenAI
import json

client = OpenAI()

def generate_answer_with_suggestions(query: str, chunks: list[str]):

    context = "\n".join(chunks)

    prompt = f"""
You are a document assistant.

Use ONLY the provided context to answer.

If the answer is not present in the context,
reply exactly with:
"Answer not found in the document."

Do NOT use outside knowledge.

If answer exists:
1. Answer clearly
2. Suggest 3 follow-up questions from the context

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
