const TasksContract = artifacts.require("TasksContract")

contract("TasksContract", () => {

    // Antes de que inicie otros testing
    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    })

    // Que voy a probar?
    it("El migrate se ha desplegado completamente", async () => {
        const address = this.tasksContract.address

        // Chai: No es igual
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, "")
    })

    // Obtener una lista de tareas
    it("Obtener lista de tareas", async () => {

        // Contrato instanciado
        const taskCounter = await this.tasksContract.taskCounter()
        const task = await this.tasksContract.tasks(taskCounter - 1)

        // Es igual, comparacion
        assert.equal(task.id.toNumber(), taskCounter - 1)
        assert.equal(task.done, false)
    })

    // Si se crea una tarea correctamente
    it("Taks create sussefully", async () => {
        const newTask = await this.tasksContract.createTask("some task", "description task");
        const taskEvent = newTask.logs[0].args

        assert.equal(taskEvent.done, false)
    })

    // Comprueba si el toggleDone funciona
    it("Task toggle done", async () => {
        const result = await this.tasksContract.toggleDone(1)
        const taskEvent = result.logs[0].args

        assert.equal(taskEvent.done, true);
    })
})