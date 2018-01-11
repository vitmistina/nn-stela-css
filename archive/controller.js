vlocity.cardframework.registerModule
.controller('taskCreateConfirm',
            ['$scope', function($scope) {

$scope.showPopup = function(){
    debugger;
    If($scope.bpTree.response.TaskCreated){
        window.alert('Task Created Successfully');
    }
  
}

}]);
