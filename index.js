var xhr = new XMLHttpRequest();
xhr.open("GET", "./data.json", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        if (this.responseText) {
            initData(JSON.parse(this.responseText));
        }
    }
};
function groupItems(itemsData, gapTime) {
    var groupResult = [];
    var minTime = itemsData[0].timestamp;
    var maxTime = itemsData.slice(-1)[0].timestamp;
    itemsData.forEach(function (item) {
        // 计算在结果中的哪个位置
        var index = Math.floor((item.timestamp - minTime) / gapTime);
        var groupItem = groupResult[index];
        if (!groupItem) {
            groupResult[index] = [];
        }
        groupResult[index].push(item);
    });
    return groupResult;
}
function initData(data) {
    // sort
    var Items = data.data;
    Items.sort(function (a, b) {
        return a.timestamp > b.timestamp ? 1 : -1;
    });
    // 得到分组数据
    var groups = groupItems(Items, 30 * 60);
    console.log(groups.length, groups);
}
