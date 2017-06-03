const xhr = new XMLHttpRequest();

xhr.open("GET", "./data.json", true)
xhr.send()


interface DataItem {
    timestamp: number; // 单位是 s
    success_count: number;
    error_count: number;
    page_per_second: number;
    total_count: number;
    left_count: number;
}

interface Data{
    error_code: number;
    success: boolean;
    message: string;
    data: DataItem[];
}

xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    if (this.responseText) {
        initData(JSON.parse(this.responseText) as Data);
    }
  }
};

function groupItems(itemsData: DataItem[], gapTime: number) {
    const groupResult = [];
    const minTime = itemsData[0].timestamp;
    const maxTime = itemsData.slice(-1)[0].timestamp;

    itemsData.forEach(item => {
        // 计算在结果中的哪个位置
        const index = Math.floor((item.timestamp - minTime) / gapTime)
        const groupItem = groupResult[index]
        if (!groupItem) { groupResult[index] = [] }
        
        groupResult[index].push(item)
    });

    return groupResult;
}

function initData(data: Data) {
    // sort
    const Items = data.data;
    Items.sort((a, b) => {
        return a.timestamp > b.timestamp ? 1 : -1
    });

    // 得到分组数据
    const groups = groupItems(Items, 30 * 60)

    console.log(groups.length, groups);
}