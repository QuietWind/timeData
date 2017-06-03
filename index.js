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
function groupItems(itemsData, gapTime, isReal /* 是否要得到最终统计数据 */) {
    if (isReal === void 0) { isReal = false; } /* 是否要得到最终统计数据 */
    var groupResult = [];
    if (isReal) {
        groupResult;
    }
    var minTime = itemsData[0].timestamp;
    var maxTime = itemsData.slice(-1)[0].timestamp;
    itemsData.forEach(function (item) {
        // 计算在结果中的哪个位置
        var index = Math.floor((item.timestamp - minTime) / gapTime);
        var groupItem = groupResult[index];
        if (isReal) {
            if (!groupItem) {
                groupResult[index] = {
                    success_count: 0,
                    error_count: 0,
                    page_per_second: 0,
                    total_count: 0,
                    left_count: 0
                };
            }
            groupResult[index].success_count += item.success_count;
            groupResult[index].error_count += item.error_count;
            groupResult[index].page_per_second += item.page_per_second;
            groupResult[index].total_count += item.total_count;
            groupResult[index].left_count += item.left_count;
        }
        else {
            if (!groupItem) {
                groupResult[index] = [];
            }
            groupResult[index].push(item);
        }
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
    var groups = groupItems(Items, 60 * 60);
    console.log(groups.length, groups);
    // 得到分组统计数据
    var groupsData = groupItems(Items, 60 * 60, true);
    console.log(groupsData);
}
