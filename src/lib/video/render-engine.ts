export interface VideoRenderer {
  queueExport(projectId: string): Promise<{
    status: "queued" | "processing";
    message: string;
  }>;
}

export class MockVideoRenderer implements VideoRenderer {
  async queueExport(projectId: string) {
    return {
      status: "queued" as const,
      message: `Export queued for ${projectId}. Connect a cloud renderer later without rewriting the workspace UI.`
    };
  }
}
