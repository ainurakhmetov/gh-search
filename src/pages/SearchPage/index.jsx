import React from 'react';
import ReactAutocomplete from 'react-autocomplete';
import axios from "axios";
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import { debounce } from 'lodash';

const FormWrapper = styled.div`
    background-color: rgb(29, 31, 39);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const ListItem = styled.div`
    padding: 5px 10px;
    font-size: 16px;
    transition: all .2s ease;
    &:hover {
        background-color: rgba(0, 0, 0, .6);
    }
`;

const StyledLink = styled(Link)`
    color: #000;
    text-decoration: none;
    
    &:hover {
        color: #fff;
        text-decoration: none;
    }
`;

const SearchInput = styled.input`
    padding: 10px 20px;
    border-radius: 5px;
    min-width: 200px;
    border: none;
    outline: none;
    font-size: 16px;
`;

const ErrorWrapper = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 30px;
`;

const Text = styled.p`
    font-size: 16px;
    color: rgb(255, 255, 255);
`;

class SearchPage extends React.Component {
    fetchDebounce = debounce(() => this.fetch(this.state.searchValue), 800);

    state = {
        searchValue: '',
        data: [],
        error: false,
    };

    fetch = (topicName) => {
        axios
            .get(`https://api.github.com/search/topics?q=${topicName}&sort=stars&per_page=15`, {
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/vnd.github.mercy-preview+json',
                },
            })
            .then((response) => {
                this.setState({
                    data: response.data.items,
                    error: false,
                });
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    };
    handleChange = (e) => {
        let text = e.target.value;
        this.setState({ searchValue: text}, () => {
            this.fetchDebounce();
        });
    };

    render() {
        const { data, searchValue, error } = this.state;
        return(
            <FormWrapper>
                <ErrorWrapper>
                    {error && (
                        <Text>
                            You have reached the maximum number of requests per minute or something wrong with your connection.
                            <br/>
                            Please, wait. :(
                        </Text>
                    )}
                </ErrorWrapper>
                <ReactAutocomplete
                    items={data}
                    inputProps={{ placeholder: 'enter topic name' }}
                    shouldItemRender={(item) => item.name}
                    getItemValue={item => item.name}
                    renderItem={item => (
                        <StyledLink
                            key={item.name}
                            to={`/${item.name}`}
                        >
                            <ListItem>{item.name}</ListItem>
                        </StyledLink>
                        )
                    }
                    renderInput={props => {
                        return <SearchInput {...props} />;
                    }}
                    value={searchValue}
                    onSelect={value => this.setState({ value })}
                    onChange={this.handleChange}
                />
            </FormWrapper>
        )
    }
}

export default SearchPage;
