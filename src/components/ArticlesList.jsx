import React, { Component } from 'react';
import { Link } from '@reach/router'

import { MuiThemeProvider, createMuiTheme, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from '@material-ui/core'

import { getArticles } from '../utils/api'
import { dateFormatter } from '../utils/dateFormatter'
import VotesComponent from './VotesComponent';

class ArticlesList extends Component {
    state = {
        articles: [],
        sort_by: "votes",
        isLoading: true,
        err: null,
    }

    componentDidMount() {
        const { sort_by } = this.state
        const {topic} = this.props
        getArticles(topic, sort_by).then((articles) => {
            this.setState({articles, isLoading: false})
        }).catch((err) => {
                this.setState({ err, isLoading: false})
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const { sort_by } = this.state
        const { topic } = this.props
        if (topic !== prevProps.topic || prevState.sort_by !== this.state.sort_by) {
            getArticles(topic, sort_by).then((articles) => {
                this.setState({articles, isLoading: false})
            }).catch((err) => {
                this.setState({ err, isLoading: false})
            })
        }
    }
    
    render() {
        const { articles, isLoading } = this.state

        if (isLoading) {
            return (
                <div className="isloading-empty-div"></div>
            )
        }

        const theme = createMuiTheme({
            overrides: {
                MuiRadio: {
                root: {
                    color: 'green',
                },
                colorSecondary: {
                    '&$checked': {
                    color: 'green',
                    },
                },
                },
            },
        });

        return (
            <main>
               
                <MuiThemeProvider theme={theme}>
                    <div className="sort-by-options">
                        <FormControl component="fieldset">
                            <FormLabel className="sort-by-label" component="legend">Sort by</FormLabel>
                            <RadioGroup aria-label="sort-by" name="sort-by" defaultValue="votes">
                                <FormControlLabel className="radio-option" value="votes" control={<Radio />} label="Votes" onChange={() => this.setState({ sort_by: "votes" })}/>
                                <FormControlLabel value="date-published" control={<Radio />} label="Date published" onChange={() => this.setState({ sort_by: "created_at" })}/>
                                <FormControlLabel value="comments" control={<Radio />} label="Comments" onChange={() => this.setState({ sort_by: "comment_count" })}/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </MuiThemeProvider>
               
                <div className="articles-list">
                    {articles.map(({ article_id, title, topic, body, author, votes, created_at }) => {
                        let bodyPreview = body.substring(0, 250)

                        let path = `${topic}/articles/${article_id}`

                        let formattedDate = dateFormatter(created_at)

                        return (
                        <section className="article-card" key={article_id}>
                                <div className="articles-list-votes-block">
                                    <VotesComponent contentType="articles" id={article_id} votes={votes} />
                                </div>
                                <div className="articles-list-article-preview">
                                    <h2><Link to={`/${path}`}>{title}</Link></h2>
                                    <h3><Link to={`/${topic}/articles`}>{ topic }</Link> | {author} | {formattedDate} </h3>
                                    <p>{bodyPreview}... <Link to={path}>Read more</Link></p>
                                </div>
                        </section>
                        )
                    })}
                </div>
            </main>
        )
        
    }
}

export default ArticlesList;