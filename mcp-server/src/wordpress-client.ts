const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cursedtours.com';
const WP_USERNAME = process.env.WP_USERNAME || '';
const WP_APP_PASSWORD = process.env.WP_APPLICATION_PASSWORD || '';

function getAuthHeader(): string {
  if (!WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error('WordPress credentials not configured. Set WP_USERNAME and WP_APPLICATION_PASSWORD environment variables.');
  }
  return 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');
}

export interface WPPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  status: string;
  date: string;
  slug: string;
  categories: number[];
  tags: number[];
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPMedia {
  id: number;
  title: { rendered: string };
  source_url: string;
  mime_type: string;
  alt_text: string;
}

async function wpFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = `${WP_URL}/wp-json/wp/v2${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (options.method && options.method !== 'GET') {
    headers['Authorization'] = getAuthHeader();
  }
  
  return fetch(url, { ...options, headers });
}

export async function getPosts(params: { per_page?: number; page?: number; status?: string } = {}): Promise<WPPost[]> {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', String(params.per_page));
  if (params.page) queryParams.set('page', String(params.page));
  if (params.status) queryParams.set('status', params.status);
  
  const response = await wpFetch(`/posts?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
  return response.json();
}

export async function getPost(id: number): Promise<WPPost> {
  const response = await wpFetch(`/posts/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch post: ${response.statusText}`);
  return response.json();
}

export async function createPost(data: {
  title: string;
  content: string;
  status?: string;
  categories?: number[];
  tags?: number[];
}): Promise<WPPost> {
  const response = await wpFetch('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create post: ${response.statusText}`);
  return response.json();
}

export async function updatePost(id: number, data: {
  title?: string;
  content?: string;
  status?: string;
  categories?: number[];
  tags?: number[];
}): Promise<WPPost> {
  const response = await wpFetch(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update post: ${response.statusText}`);
  return response.json();
}

export async function deletePost(id: number, force: boolean = false): Promise<{ deleted: boolean }> {
  const response = await wpFetch(`/posts/${id}?force=${force}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete post: ${response.statusText}`);
  return response.json();
}

export async function getCategories(params: { per_page?: number } = {}): Promise<WPCategory[]> {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', String(params.per_page));
  
  const response = await wpFetch(`/categories?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.statusText}`);
  return response.json();
}

export async function createCategory(data: { name: string; slug?: string; description?: string }): Promise<WPCategory> {
  const response = await wpFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create category: ${response.statusText}`);
  return response.json();
}

export async function updateCategory(id: number, data: { name?: string; slug?: string; description?: string }): Promise<WPCategory> {
  const response = await wpFetch(`/categories/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update category: ${response.statusText}`);
  return response.json();
}

export async function deleteCategory(id: number): Promise<{ deleted: boolean }> {
  const response = await wpFetch(`/categories/${id}?force=true`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete category: ${response.statusText}`);
  return response.json();
}

export async function getTags(params: { per_page?: number } = {}): Promise<WPTag[]> {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', String(params.per_page));
  
  const response = await wpFetch(`/tags?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch tags: ${response.statusText}`);
  return response.json();
}

export async function createTag(data: { name: string; slug?: string; description?: string }): Promise<WPTag> {
  const response = await wpFetch('/tags', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to create tag: ${response.statusText}`);
  return response.json();
}

export async function updateTag(id: number, data: { name?: string; slug?: string; description?: string }): Promise<WPTag> {
  const response = await wpFetch(`/tags/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update tag: ${response.statusText}`);
  return response.json();
}

export async function deleteTag(id: number): Promise<{ deleted: boolean }> {
  const response = await wpFetch(`/tags/${id}?force=true`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete tag: ${response.statusText}`);
  return response.json();
}

export async function getMedia(params: { per_page?: number; page?: number } = {}): Promise<WPMedia[]> {
  const queryParams = new URLSearchParams();
  if (params.per_page) queryParams.set('per_page', String(params.per_page));
  if (params.page) queryParams.set('page', String(params.page));
  
  const response = await wpFetch(`/media?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`);
  return response.json();
}

export async function uploadMedia(data: {
  filename: string;
  content: string;
  contentType: string;
  title?: string;
  alt_text?: string;
  caption?: string;
}): Promise<WPMedia> {
  const url = `${WP_URL}/wp-json/wp/v2/media`;
  const buffer = Buffer.from(data.content, 'base64');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': data.contentType,
      'Content-Disposition': `attachment; filename="${data.filename}"`,
    },
    body: buffer,
  });
  
  if (!response.ok) throw new Error(`Failed to upload media: ${response.statusText}`);
  
  const media = await response.json() as WPMedia;
  
  if (data.title || data.alt_text || data.caption) {
    const updateResponse = await wpFetch(`/media/${media.id}`, {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        alt_text: data.alt_text,
        caption: data.caption,
      }),
    });
    if (!updateResponse.ok) throw new Error(`Failed to update media metadata: ${updateResponse.statusText}`);
    return updateResponse.json();
  }
  
  return media;
}

export async function deleteMedia(id: number, force: boolean = true): Promise<{ deleted: boolean }> {
  const response = await wpFetch(`/media/${id}?force=${force}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete media: ${response.statusText}`);
  return response.json();
}

export async function introspectGraphQL(): Promise<object> {
  const response = await fetch(`${WP_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query IntrospectionQuery {
          __schema {
            types {
              name
              kind
              description
              fields {
                name
                description
                type {
                  name
                  kind
                }
              }
            }
          }
        }
      `
    }),
  });
  if (!response.ok) throw new Error(`GraphQL introspection failed: ${response.statusText}`);
  return response.json();
}

export async function executeGraphQL(query: string, variables?: object): Promise<object> {
  const response = await fetch(`${WP_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`GraphQL query failed: ${response.statusText}`);
  return response.json();
}
