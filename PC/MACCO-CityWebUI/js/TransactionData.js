var model = avalon.define({
    $id:"TransactionDate",
    currentIndex: 0,
    TimeClick: function(index) {
        model.currentIndex = index;
    }
})

$(document).ready(function () {
    $.ajax({ 
        type: "GET", 
        url: "json/TransactionData.json", 
        dataType: "json",
        async:false,  
        success: function (data) { 
            TransactionAmoun=data.Data.TransactionAmoun;
            TransactionAmounTitle=data.Data.TransactionAmounTitle;
            TransactionAmounCategories=data.Data.TransactionAmounCategories;

            PieLength=data.Data.DataTitles.length;
            Datas=data.Data.Datas;
            DataTitles=data.Data.DataTitles;
        }, 
        error: function (XMLHttpRequest, textStatus, errorThrown) { 
            alert(errorThrown); 
        } 
    });
    for(i=0;i<PieLength;i++){
        $(".DateContentDetails").append('<div id="pieChart'+i+'" class="pieChart"></div>');
    }
    var PFpic = DropDownList.create({
        select:$('#PFselect'),
        attrs:{
            column:4,
            width :300,
        },
    });
    PFpic.change(function(){
        if(PFpic.val()){
        }
    });
    var STpic = DropDownList.create({
        select:$('#STselect'),
        attrs:{
            column:2,
            width :120,
        },
    });
    STpic.change(function(){
        if(STpic.val()){
        }
    });
    var ETpic = DropDownList.create({
        select:$('#ETselect'),
        attrs:{
            column:2,
            width :130,
        },
    });
    ETpic.change(function(){
        if(ETpic.val()){
        }
    });

    $('#lineChart').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: TransactionAmounTitle,
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories:TransactionAmounCategories
        },
        yAxis: {
            title: {
                text: '交易额 (万元)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '万元'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series:TransactionAmoun
    });

    for(i=0;i<PieLength;i++){
        var CurData=Datas[i];
        var CurDataTitle=DataTitles[i]; 
        $('#pieChart'+i).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: CurDataTitle
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    size:150,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: '占比',
                colorByPoint: true,
                data:CurData
            }]
        });
    }
});