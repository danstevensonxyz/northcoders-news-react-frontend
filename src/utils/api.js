import axios from 'axios'

const newsApi = axios.create({
    baseURL: "https://nc-news-dan-stevenson.herokuapp.com/api"
})

export const getArticles = (topic, sort_by) => {
    return newsApi.get(("/articles"), {
        params: { topic, sort_by },
    }).then(({ data }) => {
        return data.articles
    })
}


export const getTopics = () => {
    return newsApi.get("/topics").then(({ data }) => {
        return data.topics
    })
}

export const getArticleById = (article_id) => {
    return newsApi.get(`/articles/${article_id}`)
        .then(({ data }) => {
            return data.article
        })
}

export const getCommentsByArticleId = (article_id) => {
    return newsApi.get(`/articles/${article_id}/comments`)
        .then(({ data }) => {
            return data.comments
        })
}

export const postComment = ((newComment, article_id) => {
    return newsApi.post(`/articles/${article_id}/comments`, newComment)
})

export const deleteComment = ((comment_id, article_id) => {
    return newsApi.delete(`/comments/${comment_id}`)
}) 

export const patchVote = (contentType, id, inc) => {
    const incrementerObj = {inc_votes: inc}
    return newsApi.patch(`${contentType}/${id}`, incrementerObj)
}

export const postArticle = (newPost => {
    return newsApi.post(`/articles`, newPost)
})