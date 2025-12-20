#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import * as wp from './wordpress-client.js';

const server = new Server(
  {
    name: 'wordpress-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_posts',
        description: 'List WordPress posts with optional pagination',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Posts per page (max 100)' },
            page: { type: 'number', description: 'Page number' },
            status: { type: 'string', description: 'Post status (publish, draft, etc.)' },
          },
        },
      },
      {
        name: 'get_post',
        description: 'Get a single WordPress post by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_post',
        description: 'Create a new WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Post title' },
            content: { type: 'string', description: 'Post content (HTML)' },
            status: { type: 'string', description: 'Post status (publish, draft)' },
            categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' },
            tags: { type: 'array', items: { type: 'number' }, description: 'Tag IDs' },
          },
          required: ['title', 'content'],
        },
      },
      {
        name: 'update_post',
        description: 'Update an existing WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' },
            title: { type: 'string', description: 'Post title' },
            content: { type: 'string', description: 'Post content (HTML)' },
            status: { type: 'string', description: 'Post status' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_post',
        description: 'Delete a WordPress post',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Post ID' },
            force: { type: 'boolean', description: 'Permanently delete (skip trash)' },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_categories',
        description: 'List all WordPress categories',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Categories per page' },
          },
        },
      },
      {
        name: 'create_category',
        description: 'Create a new category',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Category name' },
            slug: { type: 'string', description: 'Category slug' },
            description: { type: 'string', description: 'Category description' },
          },
          required: ['name'],
        },
      },
      {
        name: 'update_category',
        description: 'Update an existing category',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Category ID' },
            name: { type: 'string', description: 'Category name' },
            slug: { type: 'string', description: 'Category slug' },
            description: { type: 'string', description: 'Category description' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_category',
        description: 'Delete a category',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Category ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_tags',
        description: 'List all WordPress tags',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Tags per page' },
          },
        },
      },
      {
        name: 'create_tag',
        description: 'Create a new tag',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Tag name' },
            slug: { type: 'string', description: 'Tag slug' },
            description: { type: 'string', description: 'Tag description' },
          },
          required: ['name'],
        },
      },
      {
        name: 'update_tag',
        description: 'Update an existing tag',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Tag ID' },
            name: { type: 'string', description: 'Tag name' },
            slug: { type: 'string', description: 'Tag slug' },
            description: { type: 'string', description: 'Tag description' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_tag',
        description: 'Delete a tag',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Tag ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'list_media',
        description: 'List media library items',
        inputSchema: {
          type: 'object',
          properties: {
            per_page: { type: 'number', description: 'Items per page' },
            page: { type: 'number', description: 'Page number' },
          },
        },
      },
      {
        name: 'upload_media',
        description: 'Upload a file to the WordPress media library',
        inputSchema: {
          type: 'object',
          properties: {
            filename: { type: 'string', description: 'Filename with extension' },
            content: { type: 'string', description: 'Base64 encoded file content' },
            contentType: { type: 'string', description: 'MIME type (e.g., image/jpeg, image/png)' },
            title: { type: 'string', description: 'Media title' },
            alt_text: { type: 'string', description: 'Alt text for accessibility' },
            caption: { type: 'string', description: 'Media caption' },
          },
          required: ['filename', 'content', 'contentType'],
        },
      },
      {
        name: 'delete_media',
        description: 'Delete a media item',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Media ID' },
            force: { type: 'boolean', description: 'Permanently delete' },
          },
          required: ['id'],
        },
      },
      {
        name: 'graphql_introspect',
        description: 'Introspect the WPGraphQL schema to see available types and fields',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'graphql_query',
        description: 'Execute a custom GraphQL query against WPGraphQL',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'GraphQL query string' },
            variables: { type: 'object', description: 'Query variables' },
          },
          required: ['query'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case 'list_posts':
        result = await wp.getPosts(args as { per_page?: number; page?: number; status?: string });
        break;
      case 'get_post':
        result = await wp.getPost((args as { id: number }).id);
        break;
      case 'create_post':
        result = await wp.createPost(args as { title: string; content: string; status?: string; categories?: number[]; tags?: number[] });
        break;
      case 'update_post':
        const { id: postId, ...updateData } = args as { id: number; title?: string; content?: string; status?: string };
        result = await wp.updatePost(postId, updateData);
        break;
      case 'delete_post':
        result = await wp.deletePost((args as { id: number; force?: boolean }).id, (args as { force?: boolean }).force);
        break;
      case 'list_categories':
        result = await wp.getCategories(args as { per_page?: number });
        break;
      case 'create_category':
        result = await wp.createCategory(args as { name: string; slug?: string; description?: string });
        break;
      case 'update_category':
        const { id: catId, ...catUpdateData } = args as { id: number; name?: string; slug?: string; description?: string };
        result = await wp.updateCategory(catId, catUpdateData);
        break;
      case 'delete_category':
        result = await wp.deleteCategory((args as { id: number }).id);
        break;
      case 'list_tags':
        result = await wp.getTags(args as { per_page?: number });
        break;
      case 'create_tag':
        result = await wp.createTag(args as { name: string; slug?: string; description?: string });
        break;
      case 'update_tag':
        const { id: tagId, ...tagUpdateData } = args as { id: number; name?: string; slug?: string; description?: string };
        result = await wp.updateTag(tagId, tagUpdateData);
        break;
      case 'delete_tag':
        result = await wp.deleteTag((args as { id: number }).id);
        break;
      case 'list_media':
        result = await wp.getMedia(args as { per_page?: number; page?: number });
        break;
      case 'upload_media':
        result = await wp.uploadMedia(args as { filename: string; content: string; contentType: string; title?: string; alt_text?: string; caption?: string });
        break;
      case 'delete_media':
        result = await wp.deleteMedia((args as { id: number; force?: boolean }).id, (args as { force?: boolean }).force);
        break;
      case 'graphql_introspect':
        result = await wp.introspectGraphQL();
        break;
      case 'graphql_query':
        result = await wp.executeGraphQL((args as { query: string; variables?: object }).query, (args as { variables?: object }).variables);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('WordPress MCP Server running on stdio');
}

main().catch(console.error);
