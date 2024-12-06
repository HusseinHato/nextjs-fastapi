export const postFetcher = async <T, R> (url: string, bodyData: T): Promise<R> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      credentials: "include",
      body: JSON.stringify(bodyData),
    });
  
    if (!response.ok) {
      console.log(response);
      const error = new Error('An error occurred while fetching the data.');
      throw error;
    }
  
    return response.json() as Promise<R>;
  };

  export const postFetcherFormdata = async <T, R>(url: string, bodyData: T): Promise<R> => {
    const formData = new FormData();
  
    for (const key in bodyData) {
      if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
        const value = (bodyData as any)[key];
        formData.append(key, value instanceof File ? value : String(value));
        // Handle files if necessary
      }
    }
  
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  
    if (!response.ok) {
      console.log(response);
      throw new Error('An error occurred while fetching the data.');
    }
  
    return response.json() as Promise<R>;
  };
  