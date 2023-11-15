export interface responseAPI {
  is_plant: {
    probability: number;
    binary: boolean;
    threshold: number;
  };
  classification: {
    suggestions: {
      id: string;
      name: string;
      probability: number;
      similar_images: {
        id: string;
        url: string;
        license_name: string;
        license_url: string;
        citation: string;
        similarity: number;
        url_small: string;
      }[];
      details: {
        common_names: string[] | null;
        rank: string;
        description: {
          value: string;
          citation: string;
          license_name: string;
          license_url: string;
        };
        synonyms: string[];
        watering: object | null;
        language: string;
        entity_id: string;
      };
    }[];
  };
}
