# WordPress MCP Server

An MCP (Model Context Protocol) server for managing WordPress content through the REST API and WPGraphQL.

## Features

- **Posts Management**: Create, read, update, delete posts
- **Categories**: List, create, delete categories
- **Tags**: List, create, delete tags
- **Media Library**: Browse and delete media items
- **GraphQL**: Introspect schema and execute custom queries

## Setup

### 1. Install Dependencies

```bash
cd mcp-server
npm install
```

### 2. Configure Environment Variables

Add these to your `.env.local` or system environment:

```bash
# Already configured for the site
NEXT_PUBLIC_WORDPRESS_URL=https://cursedtours.com

# Required for write operations (create, update, delete)
WP_USERNAME=your_wordpress_username
WP_APPLICATION_PASSWORD=your_app_password
```

### 3. Generate WordPress Application Password

1. Log into WordPress admin
2. Go to Users > Profile
3. Scroll to "Application Passwords"
4. Enter a name (e.g., "MCP Server")
5. Click "Add New Application Password"
6. Copy the generated password

### 4. Build and Run

```bash
npm run build
npm start
```

Or for development:

```bash
npm run dev
```

## Available Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `list_posts` | List posts with pagination | No |
| `get_post` | Get single post by ID | No |
| `create_post` | Create new post | Yes |
| `update_post` | Update existing post | Yes |
| `delete_post` | Delete a post | Yes |
| `list_categories` | List all categories | No |
| `create_category` | Create new category | Yes |
| `update_category` | Update existing category | Yes |
| `delete_category` | Delete a category | Yes |
| `list_tags` | List all tags | No |
| `create_tag` | Create new tag | Yes |
| `update_tag` | Update existing tag | Yes |
| `delete_tag` | Delete a tag | Yes |
| `list_media` | Browse media library | No |
| `upload_media` | Upload file to media library | Yes |
| `delete_media` | Delete media item | Yes |
| `graphql_introspect` | View GraphQL schema | No |
| `graphql_query` | Execute GraphQL query | No |

## MCP Client Configuration

Add to your MCP client config (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "node",
      "args": ["path/to/mcp-server/dist/index.js"],
      "env": {
        "NEXT_PUBLIC_WORDPRESS_URL": "https://cursedtours.com",
        "WP_USERNAME": "your_username",
        "WP_APPLICATION_PASSWORD": "your_app_password"
      }
    }
  }
}
```

## Examples

### List Recent Posts
```
Tool: list_posts
Args: { "per_page": 10 }
```

### Create a Draft Post
```
Tool: create_post
Args: {
  "title": "My New Post",
  "content": "<p>Post content here...</p>",
  "status": "draft"
}
```

### Query GraphQL
```
Tool: graphql_query
Args: {
  "query": "{ posts { nodes { title slug } } }"
}
```
