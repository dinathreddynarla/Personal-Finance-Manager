let description = document.getElementsByClassName("description")[0]
let amount = document.getElementsByClassName("amount")[0]
let type = document.getElementById("type")
let table = document.getElementById("table")
let balance = 0


let addbtn = document.getElementById("add")
addbtn.addEventListener("click",()=>{
    let tr = document.createElement("tr")
    tr.innerHTML=`<td>${description.value}</td>
                    <td>${amount.value}</td>
                    <td>${type.value}</td>`

    table.appendChild(tr)
})
function updatebalance(a,b){
    if(a==="income"){
        balance +=b
    }else{
        balance -=b
    }
    
}