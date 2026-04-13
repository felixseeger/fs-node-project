Top 3 Hardening Priorities:                                                        
                                                                                     
  1. Polling resilience — Add timeout handling, exponential backoff, cancellation,   
  and clear error messaging for long operations
  2. Input validation — Validate constraints (prompt length, duration, aspect ratio) 
  on both client and server                                                          
  3. Concurrency prevention — Disable generate button during generation, cancel      
  previous polls when new generation starts, handle race conditions                  
                                                                                     
  Key principle: Expect users to lose connection, submit duplicate requests, and use
  weird inputs. Build recovery paths into every state transition.             


  