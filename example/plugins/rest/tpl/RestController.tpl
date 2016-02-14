package {{package}}.{{serviceNameLowerCase}};

import org.springframework.stereotype.Component;
import javax.ws.rs.Path;

@Component
@Path("{{servicePath}}")
public class {{serviceNameCapitalized}}RestController {

{{methods}}
}
