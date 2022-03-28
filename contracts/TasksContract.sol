// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TasksContract {
    uint256 public taskCounter = 0;

    constructor() {
        createTask("Tarea ejemplo", "XDXDXDXD");
    }

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createAt; // Las fechas son manejadas en formato timestamp
    }

    // mapping: conjunto de datos que contienen clave valor.
    mapping(uint256 => Task) public tasks;

    // Event: Los oventos hacen referencia a algo que ya paso y describe lo que regresa
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TaskToggleDone(
        uint id,
        bool done
    );

    // FUNCIONES:
    // - _var:      Hacer saber a la ()=> que seran parametros internos.
    // - public:    Hacer la funciones publicas en la blockchain
    // - memory:    Datos no persistentes
    // - storage:   Datos guardados directamente en la blockhain

    function createTask(string memory _title, string memory _description)
        public
    {
        // - block: Hace referencia al bloque en el que se esta ejecutando.
        tasks[taskCounter] = Task(
            taskCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        taskCounter += 1;

        emit TaskCreated(
            taskCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;

        emit TaskToggleDone(_id, _task.done);
    }
}
