from transformers import pipeline
import re
from sentence_transformers import SentenceTransformer, util
from .models import Petition, AIAnalysedPetition

class PetitionAnalyzer:
    def __init__(self):
        self.sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        self.similarity_model = SentenceTransformer('all-MiniLM-L6-v2')

    def analyze_sentiment(self, text):
        result = self.sentiment_pipeline(text)[0]
        return result['label'] # Returns 'POSITIVE' or 'NEGATIVE'

    def prioritize_petition(self, text):
        text = text.lower()

        high_urgency = [
            "urgent", "immediate", "emergency", "danger", "accident", "life-threatening",
            "electric shock", "fire", "sewage overflow", "flood", "collapsed"
        ]
        medium_urgency = [
            "not working", "stopped", "pending", "frequent issue", "repeated complaint",
            "delay", "inconvenient", "power cut", "garbage not collected", "water shortage"
        ]
        low_urgency = [
            "suggestion", "feedback", "small issue", "slow", "not satisfied", "minor"
        ]

        def contains_keywords(keywords):
            return any(re.search(r'\b' + re.escape(word) + r'\b', text) for word in keywords)

        if contains_keywords(high_urgency):
            return 'High'
        elif contains_keywords(medium_urgency):
            return 'Medium'
        elif contains_keywords(low_urgency):
            return 'Low'
        else:
            return 'Low'

    def is_duplicate(self, new_text, existing_texts, threshold=0.8):
        if not existing_texts:
            return False

        embeddings = self.similarity_model.encode(existing_texts + [new_text], convert_to_tensor=True)
        cosine_scores = util.pytorch_cos_sim(embeddings[-1], embeddings[:-1])
        return float(cosine_scores.max()) > threshold
