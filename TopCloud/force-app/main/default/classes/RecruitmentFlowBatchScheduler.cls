public with sharing class RecruitmentFlowBatchScheduler implements Schedulable {
    public void execute(SchedulableContext ctx) {
        // Create an instance of the batch job
        RecruitmentFlowBatch job = new RecruitmentFlowBatch();
        // Schedule the job to run
        Database.executeBatch(job);
    }
}