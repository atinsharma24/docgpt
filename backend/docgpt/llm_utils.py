import openai

def query_llm(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}]
    )
    return response.choices[0].message['content']
