import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const updateData = async (updateUrl, method = 'PATCH') => {
    setLoadingAction(true);
    try {
      const response = await axios({
        url: updateUrl,
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const updatedItem = response.data;
      setData((prevData) =>
        prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      return { updatedItem, error: null };
    } catch (error) {
      console.error('There was an error updating the data!', error);
      return { updatedItem: null, error };
    } finally {
      setLoadingAction(false);
    }
  };

  return { data, loading, error, loadingAction, updateData };
};

export default useFetch;
