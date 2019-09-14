<template>
    <v-container fluid>
        <v-row>
            <v-col cols="2">
                <v-text-field @blur="tokenChanged" v-model="githubToken" label="GitHub API Token" outlined></v-text-field>
                <v-text-field @blur="tokenChanged" v-model="zenhubToken" label="ZenHub API Token" outlined></v-text-field>
                <v-select @change="repositoryChanged" v-model="repository" :items="repositories" item-text="full_name" label="Repository" outlined return-object></v-select>
                <v-switch v-model="includeClosed" label="Include Closed"></v-switch>
                
                <!--
                <v-select @change="workspaceChanged" v-model="workspace" :items="workspaces" item-text="name" label="Workspace" outlined return-object></v-select>
                <v-select @change="pipelineChanged" v-model="pipeline" :items="pipelines" item-text="name" label="Pipeline" outlined return-object></v-select>
                -->
            </v-col>
            <v-col cols="10">
                <v-data-table :headers="headers" :items="issues" :items-per-page="-1" :loading="loadingIssues" class="elevation-1" hide-default-footer>
                    <template v-slot:item.status="{ item }"><v-icon v-if="item.state==='closed'" color="green" class="mr-2">mdi-check</v-icon></template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    /* global localStorage */
    import GitHub from '../services/GitHub'
    import ZenHub from '../services/ZenHub'

    export default {
        data: () => ({
            githubToken: null,
            zenhubToken: null,
            repositories: [],
            repository: null,
            includeClosed: false,
            repoId: null,
            workspaces: [],
            workspace: null,
            pipelines: [],
            pipeline: null,
            headers: [
                { text: '#', value: 'number' },
                { text: '', value: 'status' },
                { text: 'title', value: 'title' },
                { text: 'assignee', value: 'assignee.login' },
                { text: 'milestone', value: 'milestone.title' }
            ],
            issues: [],
            loadingIssues: false
        }),
        mounted: function() {
            this.githubToken = localStorage['github-api-token'] || '';
            this.zenhubToken = localStorage['zenhub-api-token'] || '';
            
            this.tokenChanged();
        },
        methods: {
            tokenChanged: async function() {
                localStorage['github-api-token'] = this.githubToken;
                localStorage['zenhub-api-token'] = this.zenhubToken;

                if (this.githubToken) {
                    const github = new GitHub(this.githubToken);
                    this.repositories = await github.getRepositories();
                }
            },
            
            repositoryChanged: async function(){
                this.loadingIssues = true;
                const github = new GitHub(this.githubToken);
                const state = this.includeClosed ? 'all' : 'open';
                this.issues = await github.getIssues(this.repository, state);
                this.loadingIssues = false;
            },

            // workspaceChanged: async function() {
            //     const zenhub = new ZenHub(this.zenhubToken);
            //     const board = await zenhub.getBoard(this.workspace.id, this.repoId);
            //     if (board) {
            //         this.pipelines = board.pipelines;
            //     }
            // },
            // pipelineChanged: async function() {
            //     const github = new GitHub(this.githubToken);
            //     for (const issue of this.pipeline.issues) {
            //         const data = await github.getIssue('jbat-dev', 'qu-issues', issue.issue_number);
            //         if (data) {
            //             issue.title = data.title;
            //         }
            //     }
            //     this.issues = this.pipeline.issues;
            // },
            // getColor: function(item) {
            //     if (item.estimate) {
            //         const value = item.estimate.value;

            //         if (value <= 3) {
            //             return 'green';
            //         }
            //         else if (value <= 8) {
            //             return 'orange';
            //         }
            //         else {
            //             return 'red';
            //         }
            //     }
            // }
        }
    };
</script>
