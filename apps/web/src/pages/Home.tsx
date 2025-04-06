import { useState } from 'react';
import { Link } from 'react-router';
import { client, logger } from '../config/clients';

function HomePage() {
  const [response, setResponse] = useState<string>();

  const callApi = async () => {
    const response = await client.todos.$get();

    const data = await response.json();
    logger.log(`${data}`);

    setResponse(JSON.stringify(data, null, 2));
  };

  const callApiPost = async () => {
    try {
      const response = await client.todos.$post({
        json: {
          title: 'title',
          completed: false,
        },
      });
      const data = await response.json();
      logger.log(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(e.message);
      }
    }
  };

  const callApiPut = async () => {
    // try {
    //   const response = await client.todos[':id'].$put({
    //     param: { id: '1' },
    //     json: {
    //       id: 1,
    //       title: 'title',
    //       completed: true,
    //     },
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (e) {
    //   console.error(e);
    // }
  };

  return (
    <>
      <h1>Home</h1>
      <div className='card'>
        <Link to='/about'>About</Link>
      </div>
      <div className='card'>
        <button type='button' onClick={() => callApi()}>
          Get Todos
        </button>
        <button type='button' onClick={() => callApiPost()}>
          Post Todos
        </button>
        <button type='button' onClick={() => callApiPut()}>
          Edit Todos
        </button>
      </div>
      {response && <pre>{response}</pre>}
    </>
  );
}

export default HomePage;
