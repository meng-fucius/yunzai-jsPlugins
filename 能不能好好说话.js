/**
 * 例子： hhsh yyds
 * 会返回：yyds的解释：永远滴神，音乐大师，以一当十，阴阳大师，永远单身，游刃有余(日语)，硬硬的说，永远都是，一衣带水，有一点骚，以一敌十，要胰岛素，医院等死，硬硬的屎，音乐电视，いいです，爷爷的屎，又要大筛
 */
import plugin from "../../lib/plugins/plugin.js";
import fetch from 'node-fetch';

export class hhsh extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: "能不能好好说话",
            /** 功能描述 */
            dsc: "就不能好好打字吗",
            /** https://oicqjs.github.io/oicq/#events */
            event: "message",
            /** 优先级，数字越小等级越高 */
            priority: 5000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: "^#?(好好说话|hhsh)",
                    /** 执行方法 */
                    fnc: "nbnhhsh",
                },
            ],
        });
    }
    async nbnhhsh(e) {
        let msg = e.message[0].text;
        let keyword = "";
        //如果msg包含两个hhsh，就去掉第一个
        console.log(msg.match(/hhsh/g).length);
        if (msg.match(/hhsh/g).length > 1) {
            keyword = "hhsh";
        } else {
            keyword = msg.split("好好说话")[1] || msg.split("hhsh")[1].trim();
        }
        //检查keyword是否包含中文
        if (keyword.match(/[\u4e00-\u9fa5]/g)) {
            e.reply(`请勿输入中文`);
            return false;
        }
        if (keyword == "") {
            e.reply(`让你好好说话，不是让你啥都不说`);
            return false;
        }
        const response = await fetch('https://lab.magiconch.com/api/nbnhhsh/guess', {method: 'POST', headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: keyword,
            }),});
        const json = await response.json();
        let replyMsg = `${keyword}的解释：`;
        if ("trans" in json[0]) {
            for (let index = 0; index < json[0].trans.length; index++) {
                if (index == json[0].trans.length - 1) {
                    replyMsg += json[0].trans[index];
                    break;
                }
                var stringTrans = json[0].trans[index];
                replyMsg = replyMsg + stringTrans + "，";
            }
            e.reply(replyMsg);
        } else {
            console.log(json);
            replyMsg = "没有找到解释";
            e.reply(replyMsg);
            return false;
        }
        return true;
    }
}