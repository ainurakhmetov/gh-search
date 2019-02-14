import React from 'react';
import axios from "axios";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const FormWrapper = styled.div`
    background-color: rgb(29, 31, 39);
    height: 100%;
    padding: 30px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const ItemWrapper = styled.div`
    width: 50vw;
    padding: 5px 10px;
    background-color: #fff;
    margin: 5px 0;
    border-radius: 3px;
`;

const TitleWrapper = styled.div`
    margin: 5px 3px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;

const FooterWrapper = styled.div`
    margin: 5px 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;

const Stars = styled.span`
    color: rgba(0, 0, 0, 0.65);
    display: flex;
`;

const Title = styled.span`
    font-weight: bold;
`;

const Button = styled.button`
    font-size: 16px;
    color: rgb(29, 31, 39);
    background-color: rgb(255, 255, 255);
    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 3px;
    transition: all .2s ease;
    &:hover {
        color: rgba(0, 0, 0, .6);
    }
`;

const GoBackLink = styled(Link)`
    display: flex;
    justify-content: flex-end;
    text-decoration: none;
      font-size: 16px;
    color: rgb(29, 31, 39);
    background-color: rgb(255, 255, 255);
    padding: 10px 20px;
    margin-bottom: 10px;
    border-radius: 3px;
    transition: all .2s ease;
    &:hover {
        color: rgba(0, 0, 0, .6);
    }
`;

const Text = styled.p`
    font-size: 24px;
    color: rgb(255, 255, 255);
`;

const ErrorWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 30px;
`;

const Main = styled.div`
    padding: 7px 0;
`;

const Arrow = styled.span`
     border: solid black;
     border-width: 0 3px 3px 0;
     display: inline-block;
     padding: 3px;
     transform: rotate(135deg);
     -webkit-transform: rotate(135deg);
`;

class TopicPage extends React.Component {
    state = {
        data: [],
        loading: true,
        error: false,
    };

    componentDidMount() {
        const { topic } = this.props.match.params;
        this.fetch(topic);
    }

    fetch = (topic) => {
        axios
            .get(`https://api.github.com/search/repositories?q=${topic}&sort=stars&per_page=10`, {
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/vnd.github.mercy-preview+json',
                },
            })
            .then((response) => {
                this.setState({
                    loading: false,
                    data: response.data.items,
                    error: false,
                });
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    error: true,
                });
            });
    };


    render() {
        const { data, loading, error } = this.state;
        const { topic } = this.props.match.params;
        const kFormatter = (num) => {
            return num > 999 ? (num/1000).toFixed(1) + 'K' : num
        };
        return(
            <FormWrapper>
                {!loading &&
                <GoBackLink to={`/`}>
                    <Arrow/>
                </GoBackLink>}
                {loading && <Text>Loading...</Text>}
                {!loading && !error && data.length === 0 && <Text>Empty :(</Text>}
                {error && (
                    <ErrorWrapper>
                        <Text>Download error:
                            You have reached the maximum number of requests per minute or something wrong with your connection.
                            <br/>
                            Please, try again later. :(
                        </Text>
                        <Button onClick={()=>this.fetch(topic)}>Try again</Button>
                    </ErrorWrapper>
                )}
                {data.map((item, index) => {
                    return (
                        <ItemWrapper key={index}>
                            <TitleWrapper>
                                <Title>{item.owner.login} / {item.name}</Title>
                                <Stars>{kFormatter(item.stargazers_count)}</Stars>
                            </TitleWrapper>
                            <Main>{item.description}</Main>
                            <FooterWrapper>
                                <Title>{item.language}</Title>
                                <Stars>{item.pushed_at.replace(/[A-Z]/g, " ")}</Stars>
                            </FooterWrapper>
                        </ItemWrapper>
                    )
                })}
            </FormWrapper>
        );
    }
}

export default TopicPage;
