pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo Teri maa ka bhosada start hogaya '
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'echo Teri maa ka bhosada Build Docker Image'
                sh 'docker build -t Notification-Cron:${BUILD_NUMBER} -t Notification-Cron:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
               sh 'docker stop Notification-Cron || true'
               sh 'docker rm Notification-Cron || true'
               sh 'docker run -d --name Notification-Cron -p 2025:2025 Notification-Cron:latest'
            }
        }
    }
}