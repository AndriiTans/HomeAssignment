const fs = require('fs').promises;
const path = require('path');

const SEARCH_HISTORY_FILE = path.join(__dirname, '../data/search-history.json');

class SearchModel {
    constructor() {
        this.ensureHistoryFileExists();
    }

    async ensureHistoryFileExists() {
        try {
            await fs.access(SEARCH_HISTORY_FILE);
        } catch {
            await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify({ searches: [] }, null, 2));
        }
    }

    async getSearchHistory() {
        const historyData = await fs.readFile(SEARCH_HISTORY_FILE, 'utf8');
        return JSON.parse(historyData).searches;
    }

    async addSearch(query) {
        const history = await this.getSearchHistory();
        
        const searchEntry = {
            id: Date.now().toString(),
            query,
            timestamp: new Date().toISOString(),
            resultCount: 0 
        };

        history.unshift(searchEntry);
        
        await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify({ searches: history }, null, 2));
        return searchEntry;
    }

    async updateSearchResults(searchId, resultCount) {
        const history = await this.getSearchHistory();
        const searchIndex = history.findIndex(search => search.id === searchId);
        
        if (searchIndex !== -1) {
            history[searchIndex].resultCount = resultCount;
            await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify({ searches: history }, null, 2));
        }
    }

    async clearHistory() {
        await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify({ searches: [] }, null, 2));
    }
}

module.exports = new SearchModel(); 