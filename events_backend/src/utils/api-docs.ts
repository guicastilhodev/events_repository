interface ApiEndpoint {
    method: string;
    path: string;
    description: string;
    authentication: boolean;
    parameters?: {
        required?: string[];
        optional?: string[];
        body?: any;
        query?: any;
    };
    responses: {
        success: any;
        error?: any;
    };
}

interface ApiSection {
    title: string;
    description: string;
    endpoints: ApiEndpoint[];
}

export const apiDocumentation: ApiSection[] = [
    {
        title: "Authentication",
        description: "Endpoints para autenticação de usuários",
        endpoints: [
            {
                method: "POST",
                path: "/auth/signup",
                description: "Registra um novo usuário",
                authentication: false,
                parameters: {
                    body: {
                        email: "string (required)",
                        password: "string (required)",
                        name: "string (required)",
                        organization_name: "string (required)"
                    }
                },
                responses: {
                    success: {
                        status: 201,
                        message: "Usuario criado com sucesso",
                        data: {
                            user: "User object",
                            organization: "Organization object"
                        }
                    },
                    error: {
                        status: "400|500",
                        error: "Error type",
                        message: "Error description"
                    }
                }
            },
            {
                method: "POST",
                path: "/auth/signin",
                description: "Realiza login do usuário",
                authentication: false,
                parameters: {
                    body: {
                        email: "string (required)",
                        password: "string (required)"
                    }
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Login realizado com sucesso",
                        data: {
                            user: "User object",
                            token: "JWT token"
                        }
                    }
                }
            }
        ]
    },
    {
        title: "Users",
        description: "Endpoints para gerenciamento de usuários",
        endpoints: [
            {
                method: "GET",
                path: "/users/me",
                description: "Retorna dados do usuário logado",
                authentication: true,
                responses: {
                    success: {
                        status: 200,
                        message: "Usuario encontrado com sucesso",
                        data: "User object"
                    }
                }
            },
            {
                method: "POST",
                path: "/users/profile-picture",
                description: "Upload da foto de perfil do usuário",
                authentication: true,
                parameters: {
                    body: "multipart/form-data with file"
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Profile picture uploaded successfully",
                        data: "Upload result"
                    }
                }
            },
            {
                method: "GET",
                path: "/users/profile-picture",
                description: "Retorna URL da foto de perfil do usuário",
                authentication: true,
                responses: {
                    success: {
                        status: 200,
                        message: "Profile picture URL",
                        data: {
                            profile_picture_url: "string"
                        }
                    }
                }
            }
        ]
    },
    {
        title: "Organizations",
        description: "Endpoints para gerenciamento de organizações",
        endpoints: [
            {
                method: "GET",
                path: "/organizations/me",
                description: "Retorna dados da organização do usuário",
                authentication: true,
                responses: {
                    success: {
                        status: 200,
                        message: "Organização encontrada com sucesso",
                        data: "Organization object"
                    }
                }
            },
            {
                method: "PATCH",
                path: "/organizations/me",
                description: "Atualiza dados da organização",
                authentication: true,
                parameters: {
                    body: {
                        name: "string (optional)",
                        description: "string (optional)"
                    }
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Organização atualizada com sucesso",
                        data: "Organization object"
                    }
                }
            }
        ]
    },
    {
        title: "Entities",
        description: "Endpoints para gerenciamento de entidades",
        endpoints: [
            {
                method: "GET",
                path: "/entities",
                description: "Lista entidades da organização",
                authentication: true,
                responses: {
                    success: {
                        status: 200,
                        message: "Entities encontradas com sucesso",
                        data: "Array of Entity objects"
                    }
                }
            },
            {
                method: "GET",
                path: "/entities/:entity_id",
                description: "Retorna uma entidade específica",
                authentication: true,
                parameters: {
                    required: ["entity_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Entity encontrada com sucesso",
                        data: "Entity object"
                    }
                }
            },
            {
                method: "POST",
                path: "/entities",
                description: "Cria uma nova entidade",
                authentication: true,
                parameters: {
                    body: {
                        name: "string (required)",
                        description: "string (optional)",
                        additional_info: "any (optional)"
                    }
                },
                responses: {
                    success: {
                        status: 201,
                        message: "Entity criada com sucesso",
                        data: "Entity object"
                    }
                }
            },
            {
                method: "PATCH",
                path: "/entities/:entity_id",
                description: "Atualiza uma entidade",
                authentication: true,
                parameters: {
                    required: ["entity_id (path parameter)"],
                    body: {
                        name: "string (optional)",
                        description: "string (optional)",
                        additional_info: "any (optional)"
                    }
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Entity atualizada com sucesso",
                        data: "Entity object"
                    }
                }
            },
            {
                method: "DELETE",
                path: "/entities/:entity_id",
                description: "Deleta uma entidade",
                authentication: true,
                parameters: {
                    required: ["entity_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Entity deletada com sucesso"
                    }
                }
            },
            {
                method: "POST",
                path: "/entities/:entity_id/profile-picture",
                description: "Upload da foto de perfil da entidade",
                authentication: true,
                parameters: {
                    required: ["entity_id (path parameter)"],
                    body: "multipart/form-data with file"
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Profile picture uploaded successfully",
                        data: "Upload result"
                    }
                }
            },
            {
                method: "GET",
                path: "/entities/:entity_id/profile-picture",
                description: "Retorna URL da foto de perfil da entidade",
                authentication: true,
                parameters: {
                    required: ["entity_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Profile picture URL",
                        data: {
                            profile_picture_url: "string"
                        }
                    }
                }
            }
        ]
    },
    {
        title: "Posts",
        description: "Endpoints para gerenciamento de posts",
        endpoints: [
            {
                method: "GET",
                path: "/posts",
                description: "Lista posts da organização com filtros e paginação",
                authentication: true,
                parameters: {
                    query: {
                        entity_id: "string (optional)",
                        category_name: "string (optional)",
                        user_id: "string (optional)",
                        archived: "boolean (optional)",
                        likes_min: "number (optional)",
                        likes_max: "number (optional)",
                        created_after: "date (optional)",
                        created_before: "date (optional)",
                        page: "number (optional, default: 1)",
                        per_page: "number (optional, default: 20, max: 100)",
                        order_by: "string (optional: created_at|updated_at|likes|comments)",
                        order_direction: "string (optional: asc|desc)"
                    }
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Posts listados com sucesso",
                        data: {
                            posts: "Array of Post objects",
                            total: "number",
                            page: "number",
                            per_page: "number",
                            total_pages: "number"
                        }
                    }
                }
            },
            {
                method: "GET",
                path: "/posts/all",
                description: "Lista todos os posts (sem filtro de organização)",
                authentication: true,
                parameters: {
                    query: "Same as /posts"
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Posts listados com sucesso",
                        data: "Same as /posts"
                    }
                }
            },
            {
                method: "POST",
                path: "/posts",
                description: "Cria um novo post",
                authentication: true,
                parameters: {
                    body: {
                        entity_id: "string (required)",
                        category_name: "string (required)",
                        content: "string (required)"
                    }
                },
                responses: {
                    success: {
                        status: 201,
                        message: "Post criado com sucesso",
                        data: "Post object"
                    }
                }
            },
            {
                method: "DELETE",
                path: "/posts/:post_id",
                description: "Deleta um post (soft delete)",
                authentication: true,
                parameters: {
                    required: ["post_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Post deletado com sucesso"
                    }
                }
            },
            {
                method: "POST",
                path: "/posts/:post_id/like",
                description: "Curte um post",
                authentication: true,
                parameters: {
                    required: ["post_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Post curtido com sucesso",
                        data: "Post object with updated likes"
                    }
                }
            },
            {
                method: "DELETE",
                path: "/posts/:post_id/like",
                description: "Remove like de um post",
                authentication: true,
                parameters: {
                    required: ["post_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Like removido com sucesso",
                        data: "Post object with updated likes"
                    }
                }
            },
            {
                method: "POST",
                path: "/posts/:post_id/comments",
                description: "Adiciona comentário a um post",
                authentication: true,
                parameters: {
                    required: ["post_id (path parameter)"],
                    body: {
                        content: "string (required)"
                    }
                },
                responses: {
                    success: {
                        status: 201,
                        message: "Comentário adicionado com sucesso",
                        data: "Post object with updated comments"
                    }
                }
            },
            {
                method: "DELETE",
                path: "/posts/:post_id/comments/:comment_id",
                description: "Remove comentário de um post (apenas próprios comentários)",
                authentication: true,
                parameters: {
                    required: ["post_id (path parameter)", "comment_id (path parameter)"]
                },
                responses: {
                    success: {
                        status: 200,
                        message: "Comentário removido com sucesso",
                        data: "Post object with updated comments"
                    }
                }
            }
        ]
    }
];

export const generateApiDocsHtml = (): string => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event API Documentation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background-color: #f5f7fa;
                color: #333;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 2.5em;
                font-weight: 300;
            }
            .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
                font-size: 1.1em;
            }
            .content {
                padding: 30px;
            }
            .section {
                margin-bottom: 40px;
                border-bottom: 1px solid #eee;
                padding-bottom: 30px;
            }
            .section:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .section h2 {
                color: #667eea;
                margin-bottom: 10px;
                font-size: 1.8em;
                font-weight: 500;
            }
            .section-description {
                color: #666;
                margin-bottom: 20px;
                font-size: 1.1em;
            }
            .endpoint {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                border-left: 4px solid #667eea;
            }
            .endpoint-header {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                flex-wrap: wrap;
                gap: 10px;
            }
            .method {
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 0.9em;
                min-width: 60px;
                text-align: center;
            }
            .method.GET { background: #28a745; color: white; }
            .method.POST { background: #007bff; color: white; }
            .method.PATCH { background: #ffc107; color: black; }
            .method.DELETE { background: #dc3545; color: white; }
            .path {
                font-family: 'Courier New', monospace;
                background: #e9ecef;
                padding: 8px 12px;
                border-radius: 4px;
                font-weight: bold;
                flex: 1;
                min-width: 200px;
            }
            .auth-required {
                background: #f0ad4e;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: bold;
            }
            .auth-not-required {
                background: #5cb85c;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8em;
                font-weight: bold;
            }
            .description {
                margin-bottom: 15px;
                color: #555;
                font-size: 1.05em;
            }
            .parameters, .responses {
                margin-top: 15px;
            }
            .parameters h4, .responses h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.1em;
            }
            .code-block {
                background: #2d3748;
                color: #e2e8f0;
                padding: 15px;
                border-radius: 6px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                overflow-x: auto;
                white-space: pre-wrap;
                margin: 10px 0;
            }
            .param-list {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 10px;
                margin: 10px 0;
            }
            .param-item {
                margin: 5px 0;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }
            .required {
                color: #dc3545;
                font-weight: bold;
            }
            .optional {
                color: #28a745;
            }
            .toc {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .toc h3 {
                margin-top: 0;
                color: #333;
            }
            .toc ul {
                list-style: none;
                padding: 0;
            }
            .toc li {
                margin: 8px 0;
            }
            .toc a {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .toc a:hover {
                text-decoration: underline;
            }
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }
                .header {
                    padding: 20px;
                }
                .header h1 {
                    font-size: 2em;
                }
                .content {
                    padding: 20px;
                }
                .endpoint-header {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .path {
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Event API</h1>
                <p>Documentação completa da API REST</p>
            </div>
            <div class="content">
                <div class="toc">
                    <h3>Índice</h3>
                    <ul>
                        ${apiDocumentation.map(section =>
                            `<li><a href="#${section.title.toLowerCase().replace(/\s+/g, '-')}">${section.title}</a></li>`
                        ).join('')}
                    </ul>
                </div>

                ${apiDocumentation.map(section => `
                    <div class="section" id="${section.title.toLowerCase().replace(/\s+/g, '-')}">
                        <h2>${section.title}</h2>
                        <div class="section-description">${section.description}</div>

                        ${section.endpoints.map(endpoint => `
                            <div class="endpoint">
                                <div class="endpoint-header">
                                    <span class="method ${endpoint.method}">${endpoint.method}</span>
                                    <span class="path">${endpoint.path}</span>
                                    <span class="${endpoint.authentication ? 'auth-required' : 'auth-not-required'}">
                                        ${endpoint.authentication ? '🔒 Auth Required' : '🔓 Public'}
                                    </span>
                                </div>
                                <div class="description">${endpoint.description}</div>

                                ${endpoint.parameters ? `
                                    <div class="parameters">
                                        <h4>📋 Parâmetros</h4>
                                        ${endpoint.parameters.required ? `
                                            <div class="param-list">
                                                <strong>Obrigatórios:</strong><br>
                                                ${endpoint.parameters.required.map(param =>
                                                    `<div class="param-item required">• ${param}</div>`
                                                ).join('')}
                                            </div>
                                        ` : ''}
                                        ${endpoint.parameters.optional ? `
                                            <div class="param-list">
                                                <strong>Opcionais:</strong><br>
                                                ${endpoint.parameters.optional.map(param =>
                                                    `<div class="param-item optional">• ${param}</div>`
                                                ).join('')}
                                            </div>
                                        ` : ''}
                                        ${endpoint.parameters.body ? `
                                            <div class="param-list">
                                                <strong>Body:</strong>
                                                <div class="code-block">${typeof endpoint.parameters.body === 'string' ? endpoint.parameters.body : JSON.stringify(endpoint.parameters.body, null, 2)}</div>
                                            </div>
                                        ` : ''}
                                        ${endpoint.parameters.query ? `
                                            <div class="param-list">
                                                <strong>Query Parameters:</strong>
                                                <div class="code-block">${typeof endpoint.parameters.query === 'string' ? endpoint.parameters.query : JSON.stringify(endpoint.parameters.query, null, 2)}</div>
                                            </div>
                                        ` : ''}
                                    </div>
                                ` : ''}

                                <div class="responses">
                                    <h4>✅ Resposta de Sucesso</h4>
                                    <div class="code-block">${JSON.stringify(endpoint.responses.success, null, 2)}</div>

                                    ${endpoint.responses.error ? `
                                        <h4>❌ Resposta de Erro</h4>
                                        <div class="code-block">${JSON.stringify(endpoint.responses.error, null, 2)}</div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}

                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
                    <p>📚 Event API Documentation - Gerada automaticamente</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};