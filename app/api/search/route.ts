import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';

// Move the client creation outside the handler
const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID || '',
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY || '',
  },
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200' // Add a fallback node
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const result = await client.search({
      index: 'messages',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['content', 'sender']
          }
        }
      }
    });

    const hits = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    return NextResponse.json(hits);
  } catch (error) {
    console.error('Error searching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

