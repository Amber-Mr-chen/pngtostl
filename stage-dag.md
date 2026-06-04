# Stage DAG

00 setup / domain / repo / permissions
  -> 01 research
    -> 02 PRD / route contract / user tasks
      -> 03 pricing
      -> 04 compliance
        -> 05 SEO-copy freeze
          -> 06 design source + content-fit matrix
            -> 08 backend / data contract
            -> 07 frontend implementation
              -> 10 SEO recheck
              -> 04 compliance recheck
              -> 02 PM acceptance
                -> 09 QA
                  -> 07/08 repair loop if needed
                    -> 11 launch ops
                      -> 12 data review

## Parallel Rules
- Pricing and compliance can run in parallel after PRD.
- Frontend and backend/data can run in parallel only after route contract, copy freeze, design source, and data contract are available.
- SEO recheck, compliance recheck, and PM acceptance can run in parallel after implementation.
- QA cannot be self-certified by the implementation stage.
- P0/P1 QA issues return to repair before launch.
