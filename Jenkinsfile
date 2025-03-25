pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("Environment Setup"){
            steps{
               script {
                    // Use withCredentials for more secure credential handling
                    withCredentials([file(credentialsId: 'ENV_PRODUCTION', variable: 'ENV_FILE')]) {
                        // Copy the entire .env file instead of echoing a single variable
                        sh 'cp $ENV_FILE .env'
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