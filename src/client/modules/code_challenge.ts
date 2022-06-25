// const crypto = window.crypto

// class CodeChallenge {
//     length: number;
//     sha256: boolean;
//     verifier: string | null;
//     hash: string | null;
//     constructor(length=56, sha256=true) {
//         this.length = length;
//         this.sha256 = sha256;

//         this.verifier = null;
//         this.hash = null;
//     }
//     generate(): { verifier: string, hash: string } {
//         const { length, sha256 } = this;

//         // Literally random index length amount of times
//         // I cannot bother to make this ANY better
//         // This is O(n) still so i really do not care...much
//         // Except for the hash idk how complex the hash is
//         const CHARACTER_LIST= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
//         const CHARLEN = CHARACTER_LIST.length;
    
//         let res = "";

//         for (let i = 0;i < length;i++) {
//             const randInt = crypto.randomInt(CHARLEN);

//             res += CHARACTER_LIST[randInt];
//         }

//         let hashStr = "";

//         if (sha256) {
//             const hash = crypto.createHash("sha256").update(res).digest("base64");

//             hashStr = hash;
//             // + to -
//             hashStr = hashStr.replace(/\+/g, "-");
//             // / to _
//             hashStr = hashStr.replace(/\//g, "_");
//             // Trim trailing =
//             hashStr = hashStr.replace(/=+$/, "");
//         }

//         this.verifier = res;
//         this.hash = hashStr || null;

//         return { verifier: res, hash: hashStr };
//     }
// }

// export default CodeChallenge;