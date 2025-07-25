// 修复store暴露问题
console.log('🔧 开始修复store暴露问题...');

// 等待Vue应用完全加载
setTimeout(async () => {
    try {
        // 检查Pinia实例
        if (window.pinia) {
            console.log('✅ Pinia实例已找到');

            // 动态导入store
            const { useWeb3Store } = await import('./stores/web3.js');
            const { useDataStore } = await import('./stores/data.js');
            const { useWalletStore } = await import('./stores/wallet.js');
            const { useIpfsStore } = await import('./stores/ipfs.js');

            // 创建store实例
            const web3Store = useWeb3Store();
            const dataStore = useDataStore();
            const walletStore = useWalletStore();
            const ipfsStore = useIpfsStore();

            // 暴露到全局
            window.web3Store = web3Store;
            window.dataStore = dataStore;
            window.walletStore = walletStore;
            window.ipfsStore = ipfsStore;

            console.log('✅ Store已暴露到全局:');
            console.log('  - web3Store:', web3Store);
            console.log('  - dataStore:', dataStore);
            console.log('  - walletStore:', walletStore);
            console.log('  - ipfsStore:', ipfsStore);

            // 检查钱包连接状态
            console.log('🔗 钱包连接状态:');
            console.log('  - 已连接:', web3Store.isConnected);
            console.log('  - 账户地址:', web3Store.account);
            console.log('  - 网络:', web3Store.network);

            // 检查任务数据
            console.log('📋 任务数据状态:');
            console.log('  - 任务数量:', dataStore.tasks.length);
            console.log('  - 任务列表:', dataStore.tasks);

            // 如果钱包已连接但任务为空，尝试从合约获取
            if (web3Store.isConnected && dataStore.tasks.length === 0) {
                console.log('🔄 钱包已连接但任务为空，尝试从合约获取...');
                try {
                    await dataStore.loadTasksFromContract();
                    console.log('✅ 从合约获取任务成功，任务数量:', dataStore.tasks.length);
                } catch (error) {
                    console.error('❌ 从合约获取任务失败:', error);
                }
            }

        } else {
            console.error('❌ Pinia实例未找到');
        }
    } catch (error) {
        console.error('❌ 修复store暴露失败:', error);
    }
}, 1000);

console.log('⏳ 等待Vue应用加载完成...'); 