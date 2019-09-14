import axios from 'axios'

export default class GitHub {
  
  constructor(token) {
    this.token = token;
    this.axiosClient = axios.create({
      baseURL: 'https://api.github.com',
      timeout: 10000,
      headers: {
        'Authorization': `token ${token}`
      }
    });
  }
  
  async getRepositories(){
    let result = [];
    
    const perPage = 30;
    let page = 1;
    let lastPageLength = 0;
    
    do{
        const response = await this.axiosClient.get(`/user/repos?per_page=${perPage}&page=${page}`);
        result = result.concat(response.data);
        
        lastPageLength = response.data.length;
        page++;
    }while(lastPageLength === 30);
    
    result.sort(function(a, b) {
      var nameA = a.full_name.toUpperCase(); // 大文字と小文字を無視する
      var nameB = b.full_name.toUpperCase(); // 大文字と小文字を無視する
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    
    return result;
  }
  
  async getIssues(repo, state){
    let result = [];
    
    const perPage = 30;
    let page = 1;
    let lastPageLength = 0;
    
    do{
        const response = await this.axiosClient.get(`/repos/${repo.full_name}/issues?state=${state}&per_page=${perPage}&page=${page}`);
        result = result.concat(response.data);
        
        lastPageLength = response.data.length;
        page++;
    }while(lastPageLength === 30);
    
    return result;
  }
}