var TASKMAXNUMBER = 26;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var FilterArea = React.createClass({
    handleChange: function(){
        this.props.onUserAction(this.refs.filterTextInput.getDOMNode().value, this.refs.filterTypeSelect.getDOMNode().value);
    },
    clearFilterText: function(){
        this.props.onUserAction('', this.refs.filterTypeSelect.getDOMNode().value);
        this.refs.filterTextInput.getDOMNode().focus();
    },
    render: function(){
        return (
            <div className="filter-area">
                <div className="filter-wrapper">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Filter tasks by content..."
                        value={this.props.filterObj.filterText}
                        ref="filterTextInput"
                        onChange={this.handleChange}
                    />
                    {
                        this.props.filterObj.filterText !== ''?
                        <em className="delete-icon" onClick={this.clearFilterText}></em>
                        :''
                    }
                </div>
                <select 
                    className="filter-select"
                    value={this.props.filterObj.filterType}
                    ref="filterTypeSelect"
                    onChange={this.handleChange}
                >
                    <option value="all">All tasks...</option>
                    <option value="completed">Completed tasks...</option>
                    <option value="alive">Wati to be done...</option>
                </select>
            </div>
        );
    }
});
var TaskLine = React.createClass({
    doComplete: function(){
        this.props.onTaskComplete( this.props.task );
    },
    doDelete: function(){
        this.props.onTaskDelete( this.props.task );
    },
    doUndo: function(){
        this.props.onTaskUndo( this.props.task );
    },
    fomatTime: function(ts){
        var d = new Date(ts),
            year = d.getFullYear(),
            month = ('00' + (d.getMonth() + 1)).slice(-2),
            day = ('00' + d.getDate()).slice(-2),
            hour = ('00' + d.getHours()).slice(-2),
            minute = ('00' + d.getMinutes()).slice(-2),
            second = ('00' + d.getSeconds()).slice(-2);
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    transferIndex: function(index){
        var arr = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
        return arr[index];
    },
    render: function(){
        return (
            <li className={"task-li " + (!this.props.task.alive?"dead ":"" ) + (this.props.index%2!=0?"li-even":"") }>
                {this.transferIndex(this.props.index) + ". "}
                <span className="task-content" title={this.props.task.content}>
                    {this.props.task.content}
                </span>
                <span className="create-time">
                    {this.fomatTime(this.props.task.ctime)}
                </span>
                {
                    this.props.task.alive?
                    <span className="delete-task" title="标记已完成" onClick={this.doComplete}>
                        <i className="fa fa-check"></i>
                    </span>
                    :
                    <span className="delete-task" title="删除" onClick={this.doDelete}>
                        <i className="fa fa-trash-o"></i>
                    </span>
                }
                {
                    !this.props.task.alive?
                    <span className="undo-task" title="重新打开" onClick={this.doUndo}>
                        <i className="fa fa-undo"></i>
                    </span>
                    : '' 
                }
            </li>
        );
    }
});
var TaskUl = React.createClass({
    filterTask: function(task){
        switch(this.props.filterObj.filterType){
            case 'all':
                break;
            case 'completed':
                if( task.alive ){
                    return false;
                }
                break;
            case 'alive':
                if( !task.alive ){
                    return false;
                }
                break;
        }
        if(task.content.indexOf(this.props.filterObj.filterText) >= 0){
            return true;
        }else{
            return false;
        }
    },
    render: function(){
        var arr = [];
        var index = 0;
        this.props.taskList.forEach(function(task){
            if( this.filterTask(task) ){
                arr.push(
                        <TaskLine
                            task={task}
                            index={index}
                            key={task.ctime}
                            onTaskDelete={this.props.onTaskDelete}
                            onTaskComplete={this.props.onTaskComplete}
                            onTaskUndo={this.props.onTaskUndo}
                         />
                         );
                index++;
            }
        }.bind(this));
        return (
            <ul>
                <ReactCSSTransitionGroup transitionName="ng">
                {
                    this.props.taskList.length === 0?
                        <li className="task-li task-no">No task now, add task or load default tasks first.</li> :
                        arr.length != 0?
                            arr : 
                            <li className="task-li task-no">No such task found!</li>
                }
                </ReactCSSTransitionGroup>
            </ul>
        );
    }
});
var ControlArea = React.createClass({
    getInitialState: function(){
        return{
            content: '',
            loadClicked: false,
            deleteClicked: false
        };
    },
    componentDidMount: function(){
        this.loadButton = document.querySelector('.control-area .load-button');
        this.deleteButton = document.querySelector('.control-area .delete-button');
        document.addEventListener('click', this.docClick, false);
    },
    docClick: function(e){
        var target = e.target;
        if( this.state.loadClicked && target != this.loadButton ){
            this.setState({
                loadClicked: false
            });
        }
        if( this.state.deleteClicked && target != this.deleteButton ){
            this.setState({
                deleteClicked: false
            });
        }
    },
    handleContent: function(){
        var val = this.refs.contentInput.getDOMNode().value;
        this.setState({
            content: val
        });
    },
    handleKeyup: function(e){
        if(e.keyCode === 13){
            this.doAddTask();
        }
    },
    doAddTask: function(){
        if(this.props.taskList.length >= TASKMAXNUMBER) return;
        if(this.state.content.trim() !== ''){
            this.props.addOneTask({
                content: this.state.content,
                ctime: +new Date(),
                alive: true
            });
            this.setState({
                content: ''
            });
        }
    },
    handleLoadClick: function(){
        var self = this;
        if( this.state.loadClicked || this.props.taskList.length === 0 ){
            this.doLoadTasks(function(){
                self.setState({
                    loadClicked : false
                });
            });
        }else{
            this.setState({
                loadClicked : true
            });
        }
    },
    doLoadTasks: function( callback ){
        var self = this;
        $.getJSON('stuff.json', function(data){
            self.props.loadDefaultTask(data);
            callback();
        });
    },
    handleDeleteClick: function(){
        if( !this.state.deleteClicked ){
            this.setState({
                deleteClicked : true
            });
        }else{
            this.props.deleteAllTask();
            this.setState({
                deleteClicked : false
            });
        }
    },
    clearContentInput: function(){
        this.setState({
            content: ''
        });
        this.refs.contentInput.getDOMNode().focus();
    },
    render: function(){
        var contentInputDisabled = this.props.taskList.length >= TASKMAXNUMBER? true : false;
        var addButtonDisabled = this.state.content.trim() === '' || this.props.taskList.length >= TASKMAXNUMBER ? true : false;
        var delButtonDisabled = this.props.taskList.length === 0 ? true : false;
        var loadStyle = this.state.loadClicked? {}: {display: "none"};
        var deleteStyle = this.state.deleteClicked? {}: {display: "none"};
        var limitStyle = this.props.taskList.length >= TASKMAXNUMBER? {}: {display: "none"};
        return (
            <div>
                <div className="content-wrapper">
                    <input
                        type="text"
                        className="input-area"
                        value={this.state.content}
                        onChange={this.handleContent}
                        onKeyUp={this.handleKeyup}
                        disabled={contentInputDisabled}
                        ref="contentInput"
                        placeholder="Enter Task Content..."
                    />
                    {
                        this.state.content !== ''?
                        <em className="delete-icon" onClick={this.clearContentInput}></em>
                        :''
                    }
                </div>
                <div className="control-area">
                    <button
                        className="add-button"
                        disabled={addButtonDisabled}
                        onClick={this.doAddTask}
                    >Add Task</button>
                    <button
                        className="load-button"
                        onClick={this.handleLoadClick}
                    >
                    {this.state.loadClicked? "Click Again To Confirm":"Load Default Tasks"}
                    </button>
                    <button
                        className="delete-button"
                        disabled={delButtonDisabled}
                        onClick={this.handleDeleteClick}
                    >
                    {this.state.deleteClicked? "Click Again To Confirm":"Delete All Tasks"}
                    </button>
                </div>
                <div className="tips-area">
                    <p style={loadStyle}><i className="fa fa-warning"></i>Load default tasks will override current tasks, Please confirm!</p>
                    <p style={deleteStyle}><i className="fa fa-warning"></i>Are you sure to delete all the above tasks? Please confirm!</p>
                    <p style={limitStyle}><i className="fa fa-warning"></i>26 tasks limit reached! Delete some tasks before add new one!</p>
                </div>
            </div>
        );
    }
});
var TaskListDemo = React.createClass({
    getInitialState: function(){
        return {
            taskList: this.props.taskList,
            filterObj : {
                filterText: '',
                filterType: 'all'
            }
        }
    },
    handleDelete: function(task){
        var tasks = this.state.taskList;
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
        this.setState({
            taskList: tasks
        }, this.refreshLocalStorage);
    },
    handleComplete: function(task){
        var tasks = this.state.taskList;
        var index = tasks.indexOf(task);
        tasks[index].alive = false;
        this.setState({
            taskList: tasks
        }, this.refreshLocalStorage);
    },
    handleUndo: function(task){
        var tasks = this.state.taskList;
        var index = tasks.indexOf(task);
        tasks[index].alive = true;
        this.setState({
            taskList: tasks
        }, this.refreshLocalStorage);
    },
    refreshLocalStorage: function(){
        var str = JSON.stringify(this.state.taskList);
        localStorage.setItem('task', str);
    },
    addOneTask: function(obj){
        var tasks = this.state.taskList;
        tasks.push(obj);
        this.setState({
            taskList: tasks
        }, this.refreshLocalStorage);
    },
    deleteAllTask: function(){
        var tasks = [];
        this.setState({
            taskList: tasks
        }, this.refreshLocalStorage);
    },
    loadDefaultTask: function(arr){
        this.setState({
            taskList: arr
        }, this.refreshLocalStorage);
    },
    handleUserAction: function(filterText, filterType){
        this.setState({
            filterObj: {
                filterText: filterText,
                filterType: filterType
            }
        });
    },
    render: function(){
        return (
            <div>
                <h2>Tasklist with React</h2>
                <div>
                    <FilterArea 
                        filterObj={this.state.filterObj}
                        onUserAction={this.handleUserAction}
                    />
                </div>
                <TaskUl 
                    taskList={this.state.taskList}
                    filterObj={this.state.filterObj}
                    onTaskComplete={this.handleComplete}
                    onTaskDelete={this.handleDelete}
                    onTaskUndo={this.handleUndo}
                />
                <ControlArea
                    taskList={this.state.taskList}
                    addOneTask={this.addOneTask}
                    deleteAllTask={this.deleteAllTask}
                    loadDefaultTask={this.loadDefaultTask}
                />
            </div>
        );
    }
});
var list = (function(){
    var arr = [];
    var str = localStorage.getItem('task');
    if( str ){
        arr = JSON.parse( str );
    }
    return arr;
}());
React.render(<TaskListDemo taskList={list} />, document.getElementById('demo_wrapper'));