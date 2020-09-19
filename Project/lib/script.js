var app = angular.module('myApp', []);

app.controller('mainCtrl', ['$scope', '$http', function($scope, $http){

    $scope.showMakeChangesAssignment = false;
    $scope.showMoreInformation = false;

    var loggedIn = sessionStorage.getItem("loggedIn")

    if (loggedIn == null) {
        $scope.showLogin = true;
        $scope.showCourseDirectory = false;
        $scope.showAssignments = false;
        $scope.showMyCourseFeed = false;
    }
    else if (loggedIn == "lecturer") {
        $scope.showLogin = false;
        $scope.showCourseDirectory = true;
        $scope.showAssignments = true;
        $scope.showNewCourseButton = true;
        $scope.showNewAssignmentButton = true;
        $scope.showMakeChangesButton = true;
        $scope.showDeleteCourseButton = true;
    }
    else if (loggedIn == "student") {
        $scope.showLogin = false;
        $scope.showCourseDirectory = true;
        $scope.showMyCourseFeed = true;
        $scope.showMyAssignments = true;
        $scope.showMoreInformationButton = true;
        $scope.showAddThisCourseButton = true;
    }


    //servers//
    $scope.allLogins = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/user_list.json';
    
    $scope.allCourses = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/course_directory.json';
    
    $scope.postCourses = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/update.course_directory.json';
    
    $scope.allAssignments = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/assignment_directory.json';
    
    $scope.postAssignments = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/update.assignment_directory.json'
    
    $scope.studentsCourses = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/course_association_directory.json'

    $scope.addCourseAssociation = 'https://caab.sim.vuw.ac.nz/api/ahmedshir/update.course_association_directory.json'

    $scope.assignmentInfo = function(assignmentID) {
        return 'https://caab.sim.vuw.ac.nz/api/rajivikr/assignment.' +
        assignmentID + '.json';
    };

    $scope.deleteTest = function(courseId) {
        return 'https://caab.sim.vuw.ac.nz/api/rajivikr/delete.course.' + courseId + '.json';
    };

    $scope.deleteAssignments = function(assignmentID) {
        return 'https://caab.sim.vuw.ac.nz/api/rajivikr/delete.assignment.' + assignmentID + '.json';
    };

    $scope.deleteCourseAssociation = function(courseAssociationId) {
        return 'https://caab.sim.vuw.ac.nz/api/rajivikr/delete.course_association.' + courseAssociationId + '.json';
    };


    
    //retrieving logins//
    $http.get($scope.allLogins)
        .then(function successCall(response){
            $scope.userList = response.data.users;
        },
        
        function errorCall(response){
            $scope.feedback = "Error retrieving userList from the server "
            $scope.feedback += " - ErrorCode = "
            $scope.feedback += response.status;
        })


    //retrieving courses//
    $http.get($scope.allCourses)
        .then(function successCall(response){
            $scope.courseDirectoryInfo = response.data.courses;
        },
        
        function errorCall(response){
            $scope.feedback = "Error retrieving userList from the server "
            $scope.feedback += " - ErrorCode = "
            $scope.feedback += response.status;
        })
    
    
    //retrieving assignments//
    $http.get($scope.allAssignments)
        .then(function successCall(response){
            $scope.assignmentList = response.data.assignments;
        },
        
        function errorCall(response){
            $scope.feedback = "Error retrieving userList from the server "
            $scope.feedback += " - ErrorCode = "
            $scope.feedback += response.status;
        })
    
    
    //retrieving students courses//
    $http.get($scope.studentsCourses)
        .then(function successCall(response){
            $scope.studentCourseList = response.data.courseAssociations;
        },
        
        function errorCall(response){
            $scope.feedback = "Error retrieving userList from the server "
            $scope.feedback += " - ErrorCode = "
            $scope.feedback += response.status;
        })


    //log in//

    
    //validating login details. when successful, hide the login page and show the course directory//
    $scope.checkDetails=function(){ 
        var logins = $scope.userList;
        
        for(var i = 0; i < logins.length; i++) { 
            if($scope.userName == logins[i].LoginName){
                
                if($scope.passWord == logins[i].Password){
                    
                    if(logins[i].UserType == "lecturer"){
                        $scope.showLogin = false;
                        $scope.showCourseDirectory = true;
                        $scope.showAssignments = true;
                        $scope.showNewCourseButton = true;
                        $scope.showNewAssignmentButton = true;
                        $scope.showMakeChangesButton = true;
                        $scope.showDeleteCourseButton = true;
                        sessionStorage.setItem("loggedIn", "lecturer");
                    }
                    
                    else if(logins[i].UserType == "student"){
                        $scope.showLogin = false;
                        $scope.showCourseDirectory = true;
                        $scope.showMyCourseFeed = true;
                        $scope.showMyAssignments = true;
                        $scope.showMoreInformationButton = true;
                        $scope.showAddThisCourseButton = true;
                        sessionStorage.setItem("loggedIn", "student")
                        ;

                    }
                }
            }

            else {
                $scope.loginFeedback = 'Incorrect username or password'
            }
        }
    };


    //courses//


    //New course button: shows form for new course//
    $scope.toggleNewCourse = function() {
        $scope.showNewCourse = !$scope.showNewCourse;
    };

        //Adding new course//
        $scope.postCourse = function(){

            var courseObj = {
              ID: $scope.courseID,
              Name: $scope.courseName,
              Overview: $scope.courseOverview,
              Year: $scope.courseYear,
              Trimester: $scope.courseTri,
              LectureTimes: $scope.courseTimes,
              LecturerID: $scope.courseLecturer,
            };

            $http.post($scope.postCourses, courseObj)
              .then(function successCall(data, status, headers, config){
                  $scope.feedback = "New course added.";
             }, function errorCall(data, status, headers, config){
                  $scope.feedback = "Error in adding course, please try again.";
             });
        }


    //Make changes (course) button: shows and populates form for making changes to course//
    $scope.toggleMakeChanges = function(course) {
        $scope.showMakeChanges = !$scope.showMakeChanges
        $scope.editCourseID = course.ID;
        $scope.editCourseName = course.Name;
        $scope.editCourseOverview = course.Overview;
        $scope.editCourseYear = course.Year;
        $scope.editCourseTri = course.Trimester;
        $scope.editCourseTimes = course.LectureTimes;
        $scope.editCourseLecturer = course.LecturerID;
    };

        //Posts edited course into server//
        $scope.editPostCourse = function(){

            var courseObj = {
              ID: $scope.editCourseID,
              Name: $scope.editCourseName,
              Overview: $scope.editCourseOverview,
              Year: $scope.editCourseYear,
              Trimester: $scope.editCourseTri,
              LectureTimes: $scope.editCourseTimes,
              LecturerID: $scope.editCourseLecturer,
            };

            $http.post($scope.postCourses, courseObj)
              .then(function successCall(data, status, headers, config){
                $scope.feedback = "Course successfully updated.";
             }, function errorCall(data, status, headers, config){
               $scope.feedback = "Error in updating course, please try again.";
             });
        };


    //Delete course button: deletes courses//
    $scope.delete_courses = function(course){

        var result = confirm("Are you sure you want to delete this course?");

        if (result) {
            $http.delete($scope.deleteTest(course.ID))
                .then(function successCall(response){
                        var index = $scope.courseDirectoryInfo.indexOf(course);
                        $scope.courseDirectoryInfo.splice(index,1);
                    },

                    function errorCall(response){
                        $scope.feedback = "Error in deleting course, please try again.";
                    })
        }
    };


    //course feed//

    
    //Add this course button: adds course to course feed//
    $scope.addThisCourse = function (selectedCourse) {

        var courseObj = {
            ID: selectedCourse.LecturerID,
            StudentID: 3,
            CourseID: selectedCourse.ID,
        };

        $http.post($scope.addCourseAssociation, courseObj)
            .then(function successCall(data, status, headers, config){
                $scope.feedback = "Course successfully added to course feed.";
            }, function errorCall(data, status, headers, config){
                $scope.feedback = "Error in adding course, please try again.";
            });
    }


    //(Students) Delete course button: deletes courses//
    $scope.delete_courseAssociation = function(courseAssociation){

        var result = confirm("Are you sure you want to delete this course from your course feed?");

        if (result) {
            $http.delete($scope.deleteCourseAssociation(courseAssociation.ID))
                .then(function successCall(response){

                        var index = $scope.studentCourseList.indexOf(courseAssociation);
                        $scope.studentCourseList.splice(index,1);
                    },

                    function errorCall(response){
                        $scope.feedback = "Error in deleting course, please try again.";
                    })
        }
    };



    //assignments//


    //New assignment button: shows form for a new assignment//
    $scope.toggleNewAssignment = function() {
        $scope.showNewAssignment = !$scope.showNewAssignment;
    };
    
        //Adds new assignment into server//
        $scope.postAssignment = function(){

            var assignmentObj = {
              Name: $scope.assignmentName,
              CourseID: $scope.assignmentID,
              Overview: $scope.assignmentOverview,
              DueDate: $scope.assignmentDate,
            };

            $http.post($scope.postAssignments, assignmentObj)
              .then(function successCall(data, status, headers, config){
                  $scope.feedback = "New assignment added.";
             }, function errorCall(data, status, headers, config){
                  $scope.feedback = "Error in adding assignment, please try again.";
             });
        }


    //Make changes (assignment) button: shows and populates form for making changes to assignment//
    $scope.toggleMakeChangesAssignment = function(assignment) {
        $scope.showMakeChangesAssignment = !$scope.showMakeChangesAssignment

        $scope.editID = assignment.ID;
        $scope.editAssignmentName = assignment.Name;
        $scope.editAssignmentCourseID = assignment.CourseID;
        $scope.editAssignmentOverview = assignment.Overview;
        $scope.editAssignmentDueDate = assignment.DueDate;
    };

        //Posts edited assignment into server//
        $scope.editPostAssignment = function(){

            var courseObj = {
                ID: $scope.editID,
                Name: $scope.editAssignmentName,
                CourseID: $scope.editAssignmentCourseID,
                Overview: $scope.editAssignmentOverview,
                DueDate: $scope.editAssignmentDueDate,
            };

            $http.post($scope.postAssignments, courseObj)
                .then(function successCall(data, status, headers, config){
                    $scope.feedback = "Assignment successfully updated.";
                }, function errorCall(data, status, headers, config){
                    $scope.feedback = "Error in editing assignment, please try again.";
                });
        };


    //Deletes assignment from server//
    $scope.delete_assignments = function(assignment){ 
        
        var result = confirm("Are you sure you want to delete this assignment?");
        
        if (result) {
            $http.delete($scope.deleteAssignments(assignment.ID))
            .then(function successCall(response){
                var index = $scope.assignmentList.indexOf(assignment)
                $scope.assignmentList.splice(index,1); 
        },
        
        function errorCall(response){
            $scope.feedback = "Error in deleting assignment, please try again.";
            })
        }
    };


    //Show info about specific assignment//
    $scope.toggleAssignmentInfo = function(assignment) {
        $scope.showMoreInformation = !$scope.showMoreInformation

        $http.get($scope.assignmentInfo(assignment.LecturerID))
            .then(function successCall(response){
                    $scope.assignmentInformation = response.data;
                },

                function errorCall(response){
                    $scope.feedback = "Error retrieving userList from the server "
                    $scope.feedback += " - ErrorCode = "
                    $scope.feedback += response.status;
                })
    }


    //(Students) My assignments //

    $scope.markedAsComplete = function(completedAssignment) {

            var result = confirm("Marking this assignment as complete will remove it from your list.");

            if (result) {
                $http.delete($scope.deleteAssignments(completedAssignment.ID))
                    .then(function successCall(response){
                        var index = $scope.assignmentList.indexOf(completedAssignment)
                        $scope.assignmentList.splice(index,1);
                    },

                        function errorCall(response){
                            $scope.feedback = "Error in marking assignment as complete, please try again.";
                        })
            }
    };


    //log out//

    
    //logs out user//
    $scope.logout = function() {
        sessionStorage.removeItem('loggedIn')
        location.reload();
    };
    
}]);

