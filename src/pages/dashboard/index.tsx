import React, {useState, useEffect, FormEvent} from 'react';
import {Title, Form, Repositories,Error} from './style';
import {Link} from 'react-router-dom';
import {FiChevronRight} from 'react-icons/fi';
import LogoGithub from '../../assets/logo.svg';

import api from '../../services/api';

interface Repository{
    //só as informações que eu vou usar;
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRespositories] = useState<Repository[]>(()=>{
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');
       
        if(storageRepositories){
            return JSON.parse(storageRepositories);
        }else{
            return [];
        }
    }); //tipando o array

    useEffect(()=>{
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories])

   async function handleAddRepository(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        if(!newRepo){
            setInputError('Digite o altor/nome do repositorio');
            return;
        };

        try {
            const response = await api.get<Repository>(`/repos/${newRepo}`);
            const repository = response.data;

            setRespositories([...repositories, repository]);
            setNewRepo('')
            setInputError('');
        } catch (error) {
            setInputError('erro na busca por esse repositorio');
        }

        
    }


    return(
        <>
            <img src={LogoGithub} alt="logo githubExplorer"/>
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder="Digite o nome de um repositório"/>
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
               {repositories.map(repo => (
                    <Link key={repo.full_name} to={`repositorio/${repo.full_name}`}>
                        <img src={repo.owner.avatar_url}
                        alt={repo.owner.login}/>
               
                        <div>
                            <strong>{repo.full_name}</strong>
                            <p>{repo.description}</p>
                        </div>
                        <FiChevronRight size={20}/>
                    </Link>
               ))}

            </Repositories>

          
        </>
    )
}

export default Dashboard;