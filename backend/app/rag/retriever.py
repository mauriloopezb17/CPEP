class ChromaRetriever:
    def __init__(self, collection, k: int = 10, threshold: float | None = None,):
        self.collection = collection
        self.k = k
        self.threshold = threshold

    def retrieve(self, query):
        results = self.collection.query(
            query_texts=[query],
            n_results=self.k,
        )

        documents = results["documents"][0]
        distances = results["distances"][0]
        metadatas = results["metadatas"][0]
        ids = results["ids"][0]

        if self.threshold is None or not distances:
            return {
                "documents": documents,
                "distances": distances,
                "metadatas": metadatas,
                "ids": ids,
            }

        filtered_docs = []
        filtered_distances = []
        filtered_metadatas = []
        filtered_ids = []

        for i, (doc, dist) in enumerate(zip(documents, distances)):
            similarity = 1 - dist
            if similarity >= self.threshold:
                filtered_docs.append(doc)
                filtered_distances.append(dist)
                filtered_metadatas.append(metadatas[i])
                filtered_ids.append(ids[i])

        return {
            "documents": filtered_docs,
            "distances": filtered_distances,
            "metadatas": filtered_metadatas,
            "ids": filtered_ids
        }

    def invoke(self, query):
        return self.retrieve(query)
