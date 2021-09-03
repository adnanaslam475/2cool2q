// function misingnumber(arr) {
//     for (let i = 0; i < arr.length - 1; i++) {
//         for (j = 0; j < arr.length - 1 - i; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//             }
//         }
//     }

//     let newarr = []
//     for (let i = 0; i <= 8; i++) {
//         if (!arr.includes(i)) {
//             newarr.push(i)
//         }
//     }
//     console.log(newarr)
// }
// misingnumber([3, 2, 5, 8, 5, 1])

function missingNumbers(arr) {
    var n = arr.length + 1,
        sum = 0,
        expectedSum = n * (n + 1) / 2;

    for (var i = 0, len = arr.length; i < len; i++) {
        sum += arr[i];
    }
    console.log(expectedSum-sum)
    return expectedSum - sum;
}

missingNumbers([5, 2, 6, 1, 3,8,7]);






// function nonrep(strngs) {
//     const str = strngs.split('').filter(v => v !== ' ');

//     let first = 0;
//     while (first <= str.length - 1) {
//         for (let i = 1; i <= str.length - 1; i++) {
//             if (str[first] == str[i]) {
//                 // console.log('first non repeating charcter is: ',str[first],str[i])
//                 delete str[first] ;
//                 delete str[i];
//                 console.log(str)
//             }
//             else{
//                 console.log(str);
//             }
//         }
//         first++;
//     }
//     // return str;
// };
// nonrep('mynameisadnan')


