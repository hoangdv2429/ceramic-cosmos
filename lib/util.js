
function getConsentMessage(did, addTimestamp = true) {
    const res = {
        message: 'Link this account to your identity' + '\n\n' + did,
    };
    if (addTimestamp) {
        res.timestamp = Math.floor(Date.now() / 1000);
        res.message += ' \n' + 'Timestamp: ' + res.timestamp;
    }
    return res;
}

function encodeRpcMessage(method, params) {
    return {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
    };
}

export default {
    getConsentMessage,
    encodeRpcMessage
}

//# sourceMappingURL=util.js.map