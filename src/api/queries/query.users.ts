export default {
    registerUser: `
    INSERT INTO users(
        email, 
        first_name,
        last_name,
        password
     )
     VALUES($1, $2, $3, $4)
     RETURNING *
`,
fetchUserByEmail:`
            SELECT
                user_id,
                email,
                first_name,
                last_name,
                password
            FROM users
            WHERE email = $1
    `,
fetchUserById:`
    SELECT
        user_id,
        email,
        first_name,
        last_name
    FROM users
    WHERE user_id = $1
`,

addPosts: `
  INSERT INTO posts(
    user_id,
    post_title,
    content
  )
  VALUES($1, $2, $3)
  RETURNING *
`,

getPostById: `
    SELECT 
        posts.id,
        posts.post_id,
        posts.user_id,
        post_title,
        content,
        INITCAP(TRIM(CONCAT(first_name, ' ', last_name))) AS author
    FROM posts
    LEFT JOIN users
    ON posts.user_id = users.user_id
    WHERE post_id = $1 AND is_deleted = false
`,

editPost: `
    UPDATE posts
    SET 
        updated_at = NOW(),
        post_title = $2,
        content = $3 
    WHERE post_id = $1
    RETURNING *
` ,

deletePost: `
    UPDATE posts
    SET updated_at = NOW(),
    is_deleted = true
    WHERE post_id = $1
`,

fetchAndFilterPosts: `
        SELECT 
            COUNT(post_id) OVER() AS total,
            posts.id,
            posts.user_id,
            post_id,
            post_title,
            content,
            INITCAP(TRIM(CONCAT(first_name, ' ', last_name))) AS author,
            to_char(DATE (posts.created_at)::date, 'Mon DD YYYY') As date
        FROM posts
        LEFT JOIN users
        ON posts.user_id = users.user_id
        WHERE (post_title ILIKE $1 OR $1 IS NULL) 
        AND(TRIM(CONCAT(first_name, ' ', last_name)) ILIKE TRIM($2) 
        OR TRIM(CONCAT(last_name, ' ', first_name)) ILIKE TRIM($2)
        OR $2 IS NULL)
        AND ((posts.created_at::DATE BETWEEN $3::DATE AND $4::DATE) OR ($3 IS NULL AND $4 IS NULL))
        ORDER BY posts.created_at DESC
        OFFSET $5
        LIMIT $6
`
}
