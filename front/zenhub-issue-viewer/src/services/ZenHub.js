import axios from 'axios'

export default class ZenHub {
  
  constructor(token) {
    this.token = token;
    this.axiosClient = axios.create({
      baseURL: 'https://api.zenhub.io/',
      timeout: 1000,
      headers: {
        'X-Authentication-Token': token
      }
    });
  }
  
  async getWorkspaces(repoId){
    const response = await this.axiosClient.get(`/p2/repositories/${repoId}/workspaces`);
    return response.data;
  }
  
  async getBoard(workspaceId, repoId){
    const response = await this.axiosClient.get(`/p2/workspaces/${workspaceId}/repositories/${repoId}/board`);
    return response.data;
  }
}