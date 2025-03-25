pipeline {
    agent any

    environment {
        ENV_FILE_PATH = '.env' 
    }

    
    stages {
        stage('Checkout') {
            steps {
                sh 'Checkout'
                checkout scm

            }
        }

        stage('Prepare Enviroment'){
            steps {
                script {
                    withCredentials([file(credentialsId: 'ENV_PRODUCTION', variable: 'SECRET_ENV')]) {
                        sh '''
                            cp $SECRET_ENV $ENV_FILE_PATH
                        '''
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'Build Docker Image'
                sh 'docker build -t notification-cron:${BUILD_NUMBER} -t notification-cron:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
               sh 'docker stop notification-cron || true'
               sh 'docker rm notification-cron || true'
               sh 'docker run -d --name notification-cron -p 2025:2025 notification-cron:latest'
            }
        }
    }
    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}