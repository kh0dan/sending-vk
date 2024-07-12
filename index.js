const { VK, Keyboard } = require('vk-io');
const vk = new VK({
    token: TOKEN,
    pollingGroupId: GROUP_ID,
    apiVersion: 5.131,
});

async function getUserIds() {
    try {
        let userIds = new Set();
        let offset = 0;
        let count = 200;

        while (true) {
            const conversations = await vk.api.messages.getConversations({
                offset: offset,
                count: count,
                filter: 'all'
            });

            if (conversations.items.length === 0) {
                break;
            }

            conversations.items.forEach(item => {
                const peerId = item.conversation.peer.id;
                if (peerId < 2000000000) {
                    userIds.add(peerId);
                }
            });

            offset += count;
        }

        return [...userIds];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function sendMessages(userIds) {
    for (const userId of userIds) {
        try {
            await vk.api.messages.send({
                user_id: userId,
                message: `Рассылка сообщений в сообществе ВК\n\nhttps://github.com/kh0dan/sending-vk`,
                random_id: Math.floor(Math.random() * 100000)
            });
            console.log(`send ${userId}`);
        } catch (error) {
            console.error(`error ${userId}:`, error);
        }
    }
}

async function main() {
    const userIds = await getUserIds();
    if (userIds.length > 0) {
        await sendMessages(userIds);
    } else {
        console.log('Нет пользователей для отправки сообщений.');
    }
}

main();
