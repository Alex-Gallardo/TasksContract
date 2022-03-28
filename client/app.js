App = {
    contracts: {},
    web3provider: '',
    tasksContract: {},

    init: async ()=>{
        console.log('Cargando...')
        await App.loadETH()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.renderTasks()
    },

    // CARGAR ETHEREUM
    loadETH: async ()=>{
        if(window.ethereum){
            App.web3provider = window.ethereum
            await window.ethereum.request({method: 'eth_requestAccounts'})
        }else if(window.web3){
            web3 = new Web3(window.web3.currentProvider)
        } else{
            console.log('Ethereum no instalado.')
        }
    }, 

    // CARGAR CUENTA
    loadAccount: async ()=>{
        const accounts =await window.ethereum.request({method: 'eth_requestAccounts'})
        App.account = accounts[0]
    },

    // PARA OBTENER LOS DATOS DEL CONTRATO << Se modifico el archibo. bs-config.json >>
    loadContracts: async ()=>{
        const res = await fetch("TasksContract.json")

        const tasksContractJSON = await res.json()
        
        App.contracts.tasksContract = TruffleContract(tasksContractJSON)
        
        App.contracts.tasksContract.setProvider(App.web3provider)

        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    // RENDER: PINTA LA LISTA DE DATOS
    render: ()=>{
        document.getElementById("account").innerText = App.account
    },

    renderTasks: async ()=>{

        // CUANTAS TAREAS HAY EN LA BLOCKCHAIN
        const taskCounter = await App.tasksContract.taskCounter()
        const taskCNumber = taskCounter.toNumber()

        let html = ''

        for( let i = 1; i <= taskCNumber; i++){

            // Tarea con lista de subtareas
            const task = await App.tasksContract.tasks(i)
            // const taskId = task[0] 

            let taskElement = `
                <div class="card bg-dark rounded-0 mb-2">
                    <div class="card-header d-flex justify-content-between aling-items-center">
                        <span>${task[1]}</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" data-id="${task[0]}" ${task[3] && "checked"} onchange="App.toggleDone(this)"/>
                        </div>
                    </div>
                    <div class="card-body">
                        <span>${task[2]}</span>
                        <p class="text-muted" >Task was created: ${new Date(task[4] * 1000).toLocaleString()}<p>
                    </div>
                </div>
            `

            html += taskElement
        }

        document.getElementById('tasksList').innerHTML = html;
    },

    // CREAR UNA TAREA
    createTask: async (title, description)=>{

        console.log("create-task:", await App.tasksContract)

        const result = await App.tasksContract.createTask(title, description,  {
            from: App.account
        })

        console.log(result.logs[0].args)
    },

    // ACTUALIZAR DATOS
    toggleDone: async (element)=>{
        const taskId = element.dataset.id

        // Llamar al contrato-inteligente
        await App.tasksContract.toggleDone(taskId, { from: App.account})

        window.location.reload()
    }

}

// App.init()